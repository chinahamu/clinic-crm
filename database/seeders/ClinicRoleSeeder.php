<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\ClinicRole;
use Spatie\Permission\Models\Role;

class ClinicRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // staff ガードのロールを各クリニックに紐付ける（存在しない場合のみ）
        $clinics = Clinic::all();
        $roles = Role::where('guard_name', 'staff')->get();

        foreach ($clinics as $clinic) {
            foreach ($roles as $role) {
                ClinicRole::firstOrCreate([
                    'clinic_id' => $clinic->id,
                    'role_id' => $role->id,
                ], [
                    'label' => $role->name,
                ]);
            }
        }
    }
}
