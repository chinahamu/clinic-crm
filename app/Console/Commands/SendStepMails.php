<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use App\Models\StepMailLog;
use App\Mail\FollowUpMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class SendStepMails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'crm:send-step-mails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send automated step mails based on visit history.';

    /**
     * Execute the console command.
     */
    protected $lineService;
    protected $messageService;

    public function __construct(\App\Services\LineMessagingService $lineService, \App\Services\MessageContentService $messageService)
    {
        parent::__construct();
        $this->lineService = $lineService;
        $this->messageService = $messageService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Step Mail sending process (DB Driven)...');
        Log::info('crm:send-step-mails started.');

        $scenarios = \App\Models\MailScenario::active()->get();

        foreach ($scenarios as $scenario) {
            $this->processScenario($scenario);
        }

        $this->info('Step Mail sending process completed.');
        Log::info('crm:send-step-mails completed.');
    }

    private function processScenario(\App\Models\MailScenario $scenario)
    {
        $this->info("Processing Scenario: {$scenario->name}");

        // Calculate target date: today - days_offset
        // Example: if offset is 1, target is yesterday. logic: visited on yesterday implies 1 day passed.
        $targetDate = Carbon::today()->subDays($scenario->days_offset)->toDateString();
        
        // Initial query based on trigger_type
        // Note: Currently primarily supporting 'after_visit' logic as per request context
        if ($scenario->trigger_type === 'after_visit') {
            $query = Reservation::query()
                ->whereDate('start_time', $targetDate)
                ->where('status', 'visited') // Assuming 'visited' status key
                ->where('clinic_id', $scenario->clinic_id)
                ->whereHas('user')
                ->with('user');
        } else {
            // Placeholder for other triggers if implemented
            $this->warn("Unknown trigger type: {$scenario->trigger_type}");
            return;
        }

        $query->chunk(100, function ($reservations) use ($scenario) {
            foreach ($reservations as $reservation) {
                $user = $reservation->user;

                // Duplicate Check using scenario ID
                if ($this->checkIfSent($user, "scenario:{$scenario->id}", $reservation->id)) {
                    continue;
                }

                // Prepare Content
                $subject = $this->replacePlaceholders($scenario->subject, $user, $reservation);
                $body = $this->replacePlaceholders($scenario->body, $user, $reservation);

                try {
                    $channel = 'mail'; // Default
                    if ($user->line_id) {
                        // --- LINE ---
                        // LINE subject handling: Prepend to body or ignore?
                        // User request: "Subject is ignored or joined to first line"
                        $lineText = "【{$subject}】\n\n" . $body;
                        
                        if ($this->lineService->pushMessage($user->line_id, $lineText)) {
                            $channel = 'line';
                        } else {
                            Log::error("Failed to send LINE for Scenario {$scenario->id} to User {$user->id}");
                            // Fallback logic or skip? Assuming skip to avoid duplicate mail if LINE was intended
                            continue;
                        }
                    } else {
                        // --- Mail ---
                        $mail = new FollowUpMail(
                            $user,
                            $subject,
                            'emails.step_mail', // Generic view
                            ['body' => $body]
                        );

                        // Override sender if configured
                        if ($scenario->sender_name) {
                            $mail->from(config('mail.from.address'), $scenario->sender_name);
                        }

                        Mail::to($user)->queue($mail);
                        $channel = 'mail';
                    }

                    // Log
                    $this->logSent($user, "scenario:{$scenario->id}", $reservation->id, $channel);
                    $this->info("Sent scenario '{$scenario->name}' via {$channel} to User ID: {$user->id}");

                } catch (\Exception $e) {
                    Log::error("Step delivery failed for Scenario {$scenario->id}, User {$user->id}: " . $e->getMessage());
                }
            }
        });
    }

    private function replacePlaceholders($text, $user, $reservation)
    {
        $replacements = [
            '{name}' => $user->name,
            '{clinic_name}' => config('app.name'),
            '{visit_date}' => Carbon::parse($reservation->start_time)->format('Y年m月d日'),
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $text);
    }

    private function checkIfSent($user, $type, $reservationId)
    {
        return StepMailLog::where('user_id', $user->id)
            ->where('mail_type', $type)
            ->where('reservation_id', $reservationId)
            ->exists();
    }

    private function logSent($user, $type, $reservationId, $channel)
    {
        StepMailLog::create([
            'user_id' => $user->id,
            'reservation_id' => $reservationId,
            'mail_type' => $type,
            'channel' => $channel,
        ]);
    }
}
