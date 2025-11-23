<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

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

        // Ensure common roles exist for staff guard
        $roleNames = ['doctor', 'nurse', 'reception', 'counselor', 'admin'];
        foreach ($roleNames as $r) {
            Role::firstOrCreate(['name' => $r, 'guard_name' => 'staff']);
        }

        // Create guaranteed staff test user from README
        $staffUser = Staff::firstOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'テスト スタッフ',
                'password' => Hash::make('password'),
                'clinic_id' => $clinic->id,
            ]
        );
        $staffUser->assignRole('reception');

        // Create Filament admin user referenced in README
        $filament = Staff::firstOrCreate(
            ['email' => 'kento.takamatsu@meta-alchemist.co.jp'],
            [
                'name' => 'Filament 管理者',
                'password' => Hash::make('ChangeMe123!'),
                'clinic_id' => $clinic->id,
            ]
        );
        $filament->assignRole('admin');

        // Create additional staff members
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
