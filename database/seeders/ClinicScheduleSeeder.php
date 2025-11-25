<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\ClinicSchedule;
use App\Models\ClinicScheduleException;
use Carbon\Carbon;

class ClinicScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinics = Clinic::all();

        foreach ($clinics as $clinic) {
            // Regular Schedule
            // Mon(1) - Fri(5): 09:00 - 18:00
            // Sat(6): 09:00 - 13:00
            // Sun(0): Closed
            
            for ($i = 0; $i <= 6; $i++) {
                $startTime = '09:00';
                $endTime = '18:00';
                $isClosed = false;

                if ($i === 6) { // Saturday
                    $endTime = '13:00';
                } elseif ($i === 0) { // Sunday
                    $isClosed = true;
                    $startTime = null;
                    $endTime = null;
                }

                ClinicSchedule::updateOrCreate(
                    [
                        'clinic_id' => $clinic->id,
                        'day_of_week' => $i,
                    ],
                    [
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'is_closed' => $isClosed,
                    ]
                );
            }

            // Exceptions
            // Next Holiday (e.g., New Year's or just a random future date)
            $nextHoliday = Carbon::today()->addMonth()->startOfMonth(); // 1st of next month
            
            ClinicScheduleException::create([
                'clinic_id' => $clinic->id,
                'date' => $nextHoliday,
                'is_closed' => true,
                'note' => '臨時休診',
            ]);

            // Shortened hours for another day
            $shortDay = Carbon::today()->addWeeks(2)->startOfWeek()->addDays(2); // Wednesday in 2 weeks
            ClinicScheduleException::create([
                'clinic_id' => $clinic->id,
                'date' => $shortDay,
                'start_time' => '10:00',
                'end_time' => '15:00',
                'is_closed' => false,
                'note' => '短縮営業',
            ]);
        }
    }
}
