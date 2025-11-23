<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure patient role exists
        $role = Role::firstOrCreate(['name' => 'patient', 'guard_name' => 'web']);

        // Create guaranteed test patient user from README
        $patient = User::firstOrCreate(
            ['email' => 'patient@example.com'],
            [
                'name' => 'テスト 患者',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => null,
            ]
        );
        $patient->assignRole($role);

        // Create additional random patients
        User::factory()
            ->count(50)
            ->create()
            ->each(function ($user) use ($role) {
                $user->assignRole($role);
            });
    }
}
