<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure patient role exists
        $role = Role::firstOrCreate(['name' => 'patient', 'guard_name' => 'web']);

        // Create 50 patients
        User::factory()
            ->count(50)
            ->create()
            ->each(function ($user) use ($role) {
                $user->assignRole($role);
            });
    }
}
