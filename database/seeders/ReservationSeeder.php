<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Machine;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        $users = User::role('patient')->get();
        $menus = Menu::all();
        $staffs = Staff::where('clinic_id', $clinic->id)->get();
        $rooms = Room::where('clinic_id', $clinic->id)->get();
        $machines = Machine::where('clinic_id', $clinic->id)->get();

        if ($users->isEmpty() || $menus->isEmpty() || $staffs->isEmpty() || $rooms->isEmpty()) {
            return;
        }

        $clinic->load(['schedules', 'exceptions']);

        foreach ($users as $user) {
            // Create 1-5 reservations per user
            $count = rand(1, 5);
            for ($i = 0; $i < $count; $i++) {
                $menu = $menus->random();
                $duration = $menu->duration_minutes ?? 60;
                
                // Find a valid time slot
                $attempts = 0;
                while ($attempts < 50) {
                    $attempts++;
                    $date = Carbon::today()->addDays(rand(-30, 30));
                    
                    // Check exceptions
                    $exception = $clinic->exceptions->firstWhere('date', $date->toDateString());
                    if ($exception && $exception->is_closed) {
                        continue;
                    }

                    // Check regular schedule
                    $dayOfWeek = $date->dayOfWeek; // 0 (Sun) - 6 (Sat)
                    // Carbon's dayOfWeek is 0 for Sunday, which matches our DB 0=Sunday
                    
                    $schedule = $clinic->schedules->firstWhere('day_of_week', $dayOfWeek);
                    
                    if (!$schedule && !$exception) {
                        // No schedule and no exception means closed? Or default open?
                        // Usually if no schedule, we assume closed or default hours.
                        // Let's assume closed if not defined.
                        continue;
                    }

                    if ($schedule && $schedule->is_closed && !$exception) {
                        continue;
                    }

                    // Determine open hours for this day
                    $openTimeStr = $exception ? $exception->start_time : $schedule->start_time;
                    $closeTimeStr = $exception ? $exception->end_time : $schedule->end_time;

                    if (!$openTimeStr || !$closeTimeStr) {
                        continue;
                    }

                    $openTime = Carbon::parse($date->toDateString() . ' ' . $openTimeStr);
                    $closeTime = Carbon::parse($date->toDateString() . ' ' . $closeTimeStr);

                    // Calculate max start time
                    $maxStartTime = $closeTime->copy()->subMinutes($duration);

                    if ($openTime->gt($maxStartTime)) {
                        continue; // Duration doesn't fit
                    }

                    // Pick random start time
                    // Simple approach: random minutes added to openTime
                    $diffInMinutes = $openTime->diffInMinutes($maxStartTime);
                    $randomAdd = rand(0, $diffInMinutes / 15) * 15; // 15 min intervals
                    
                    $startTime = $openTime->copy()->addMinutes($randomAdd);
                    $endTime = $startTime->copy()->addMinutes($duration);

                    Reservation::factory()->create([
                        'user_id' => $user->id,
                        'menu_id' => $menu->id,
                        'staff_id' => $staffs->random()->id,
                        'room_id' => $rooms->random()->id,
                        'machine_id' => $machines->isNotEmpty() ? $machines->random()->id : null,
                        'clinic_id' => $clinic->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                    ]);
                    break; // Success
                }
            }
        }
    }
}
