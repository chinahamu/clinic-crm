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

        // ロール名 -> 日本語ラベルのマッピング（必要に応じて追加してください）
        $labelMap = [
            'owner' => 'オーナー',
            'admin' => '管理者',
            'manager' => 'マネージャー',
            'doctor' => '医師',
            'reception' => '受付',
            'nurse' => '看護師',
            'staff' => 'スタッフ',
        ];

        foreach ($clinics as $clinic) {
            foreach ($roles as $role) {
                // 既存レコードがあればラベルを上書きして日本語にする
                ClinicRole::updateOrCreate([
                    'clinic_id' => $clinic->id,
                    'role_id' => $role->id,
                ], [
                    'label' => $labelMap[$role->name] ?? $role->name,
                ]);
            }
        }
    }
}
