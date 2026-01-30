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
        $this->info('Starting Step Mail sending process...');
        Log::info('crm:send-step-mails started.');

        $this->sendPostVisitThankYou();
        $this->sendSixMonthReminder();

        $this->info('Step Mail sending process completed.');
        Log::info('crm:send-step-mails completed.');
    }

    private function sendPostVisitThankYou()
    {
        $targetDate = Carbon::yesterday();
        $this->info("Processing Post Visit Thank You for {$targetDate->toDateString()}...");

        Reservation::query()
            ->whereDate('start_time', $targetDate)
            ->where('status', 'visited')
            ->whereHas('user')
            ->with('user')
            ->chunk(100, function ($reservations) {
                foreach ($reservations as $reservation) {
                    $user = $reservation->user;

                    // 重複チェック
                    if ($this->checkIfSent($user, 'post_visit_thank_you', $reservation->id)) continue;

                    try {
                        $channel = 'mail'; // Default
                        if ($user->line_id) {
                            // --- LINE送信ルート ---
                            $text = $this->messageService->getThankYouText($user);
                            if ($this->lineService->pushMessage($user->line_id, $text)) {
                                $channel = 'line';
                            } else {
                                // Fallback to mail if LINE fails? 
                                // Requirements said "If line_id exists -> LINE". Implicitly if fail, maybe log?
                                // "LINE送信時に 400 ... エラーログに残して次のユーザーへ進む" -> So just log and continue.
                                // But if it fails, do we mark as sent? Probably not effectively sent if failed.
                                // However, strictly following "line_id exists -> LINE", if it fails, we shouldn't send mail as duplicate.
                                // Let's assume failure means we log and don't record success in DB, so it might retry if logic allowed, 
                                // but my logic checks DB. So if I don't write DB, it will help.
                                Log::error("Failed to send LINE thank you to User {$user->id}");
                                continue; 
                            }
                        } else {
                            // --- メール送信ルート ---
                            Mail::to($user)->queue(new FollowUpMail(
                                $user,
                                'ご来院ありがとうございます【クリニックCRM】',
                                'emails.followup.thank_you'
                            ));
                            $channel = 'mail';
                        }

                        // ログ保存
                        $this->logSent($user, 'post_visit_thank_you', $reservation->id, $channel);
                        $this->info("Sent thank you ({$channel}) to User ID: {$user->id}");

                    } catch (\Exception $e) {
                        Log::error("Step delivery failed for User {$user->id}: " . $e->getMessage());
                    }
                }
            });
    }

    private function sendSixMonthReminder()
    {
        $targetDate = Carbon::now()->subMonths(6);
        $this->info("Processing 6 Month Reminder for visits on {$targetDate->toDateString()}...");

        Reservation::query()
            ->whereDate('start_time', $targetDate)
            ->where('status', 'visited')
            ->whereHas('user')
            ->with('user')
            ->chunk(100, function ($reservations) {
                foreach ($reservations as $reservation) {
                    $user = $reservation->user;

                    // Check for newer reservations
                    $hasNewerReservation = Reservation::where('user_id', $user->id)
                        ->where('start_time', '>', $reservation->start_time)
                        ->exists();

                    if ($hasNewerReservation) {
                        continue;
                    }

                    // 重複チェック
                    if ($this->checkIfSent($user, 'inactive_6_months', $reservation->id)) continue;

                    try {
                        $channel = 'mail';
                        if ($user->line_id) {
                            // LINE
                            $text = $this->messageService->getSixMonthReminderText($user);
                            if ($this->lineService->pushMessage($user->line_id, $text)) {
                                $channel = 'line';
                            } else {
                                Log::error("Failed to send LINE reminder to User {$user->id}");
                                continue;
                            }
                        } else {
                            // Mail
                            Mail::to($user)->queue(new FollowUpMail(
                                $user,
                                '定期検診のご案内【クリニックCRM】',
                                'emails.followup.reminder_6_months'
                            ));
                            $channel = 'mail';
                        }

                        // Log
                        $this->logSent($user, 'inactive_6_months', $reservation->id, $channel);
                        $this->info("Sent 6-month reminder ({$channel}) to User ID: {$user->id}");

                    } catch (\Exception $e) {
                         Log::error("Step delivery failed for User {$user->id}: " . $e->getMessage());
                    }
                }
            });
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
