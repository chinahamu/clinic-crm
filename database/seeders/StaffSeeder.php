<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first(); // Assuming a clinic exists from ClinicSeeder

        if (!$clinic) {
            $clinic = Clinic::factory()->create();
        }

        $roles = ['doctor', 'nurse', 'reception', 'counselor'];

        foreach ($roles as $roleName) {
            Staff::factory()
                ->count(3)
                ->create(['clinic_id' => $clinic->id])
                ->each(function ($staff) use ($roleName) {
                    $staff->assignRole($roleName);
                });
        }
    }
}
