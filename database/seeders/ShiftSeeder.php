<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Shift;
use App\Models\Staff;
use Illuminate\Database\Seeder;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        $staffs = Staff::where('clinic_id', $clinic->id)->get();

        if ($staffs->isEmpty()) {
            return;
        }

        foreach ($staffs as $staff) {
            // Create shifts for the next 30 days
            for ($i = 0; $i < 30; $i++) {
                if (rand(0, 1) === 0) continue; // Skip some days

                Shift::factory()->create([
                    'staff_id' => $staff->id,
                    'clinic_id' => $clinic->id,
                    'start_time' => now()->addDays($i)->setHour(9)->setMinute(0),
                    'end_time' => now()->addDays($i)->setHour(18)->setMinute(0),
                ]);
            }
        }
    }
}
