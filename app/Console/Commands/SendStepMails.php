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

        // Find reservations from yesterday with 'visited' status
        Reservation::query()
            ->whereDate('start_time', $targetDate)
            ->where('status', 'visited')
            ->whereHas('user') // Ensure user exists
            ->with('user')
            ->chunk(100, function ($reservations) {
                foreach ($reservations as $reservation) {
                    try {
                        // Check if already sent
                        $exists = StepMailLog::where('user_id', $reservation->user_id)
                            ->where('mail_type', 'post_visit_thank_you')
                            ->where('reservation_id', $reservation->id)
                            ->exists();

                        if ($exists) {
                            continue;
                        }

                        // Send Mail
                        Mail::to($reservation->user)->queue(new FollowUpMail(
                            $reservation->user,
                            'ご来院ありがとうございます【クリニックCRM】',
                            'emails.followup.thank_you'
                        ));

                        // Log
                        StepMailLog::create([
                            'user_id' => $reservation->user_id,
                            'reservation_id' => $reservation->id,
                            'mail_type' => 'post_visit_thank_you',
                        ]);

                        $this->info("Sent thank you mail to User ID: {$reservation->user_id}");

                    } catch (\Exception $e) {
                        Log::error("Failed to send thank you mail to User ID: {$reservation->user_id}. Error: " . $e->getMessage());
                    }
                }
            });
    }

    private function sendSixMonthReminder()
    {
        // Logic: 6 months ago EXACTLY? Or around 6 months?
        // Requirement says "just 6 months ago" (exact date match for the run)
        $targetDate = Carbon::now()->subMonths(6);
        $this->info("Processing 6 Month Reminder for visits on {$targetDate->toDateString()}...");

        Reservation::query()
            ->whereDate('start_time', $targetDate)
            ->where('status', 'visited')
            ->whereHas('user')
            ->with('user')
            ->chunk(100, function ($reservations) {
                foreach ($reservations as $reservation) {
                    try {
                         // Check if user has ANY future reservation or reservation AFTER the 6 month mark
                         $hasNewerReservation = Reservation::where('user_id', $reservation->user_id)
                            ->where('start_time', '>', $reservation->start_time)
                            ->exists();

                        if ($hasNewerReservation) {
                            continue;
                        }

                        // Check if already sent (avoid duplicate for this specific type recently?)
                        // Since it's triggered by a specific past reservation, check against that reservation
                        // OR check if we sent this type within the last X days to avoid spam if script runs multiple times?
                        // Using reservation_id as key is safest if we tie it to that specific visit 6 months ago.
                        
                        $exists = StepMailLog::where('user_id', $reservation->user_id)
                            ->where('mail_type', 'inactive_6_months')
                            ->where('reservation_id', $reservation->id)
                            ->exists();

                        if ($exists) {
                            continue;
                        }

                        // Send Mail
                        Mail::to($reservation->user)->queue(new FollowUpMail(
                            $reservation->user,
                            '定期検診のご案内【クリニックCRM】',
                            'emails.followup.reminder_6_months'
                        ));

                        // Log
                        StepMailLog::create([
                            'user_id' => $reservation->user_id,
                            'reservation_id' => $reservation->id,
                            'mail_type' => 'inactive_6_months',
                        ]);

                        $this->info("Sent 6-month reminder to User ID: {$reservation->user_id}");

                    } catch (\Exception $e) {
                        Log::error("Failed to send 6-month reminder to User ID: {$reservation->user_id}. Error: " . $e->getMessage());
                    }
                }
            });
    }
}
