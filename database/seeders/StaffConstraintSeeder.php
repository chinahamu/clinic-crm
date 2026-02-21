<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StaffConstraintSeeder extends Seeder
{
    /**
     * スタッフごとの勤務可能曜日パターン。
     * インデックスの剰り算で割り当てるため、スタッフ数が 5 名を超えても各パターンが入る。
     */
    private const DAY_PATTERNS = [
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ['Mon', 'Wed', 'Thu', 'Fri'],
        ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    ];

    /** 週最大勤務時間のバリエーション */
    private const MAX_HOURS_OPTIONS = [30, 35, 40, 40, 45];

    /**
     * スタッフごとの勤務制約を登録する。
     *
     * 対象テーブル : staff_constraints
     * 前提シーダー : ClinicSeeder, StaffSeeder
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (! $clinic) {
            $this->command->warn('StaffConstraintSeeder: Clinic が見つかりません。');

            return;
        }

        $staffs = Staff::where('clinic_id', $clinic->id)->get();
        if ($staffs->isEmpty()) {
            $this->command->warn('StaffConstraintSeeder: スタッフが存在しません。');

            return;
        }

        $now     = now();
        $inserts = [];

        foreach ($staffs as $index => $staff) {
            // 冕等性確保: 既に制約が存在する場合はスキップ
            $exists = DB::table('staff_constraints')
                ->where('staff_id', $staff->id)
                ->exists();

            if ($exists) {
                continue;
            }

            $maxHours      = self::MAX_HOURS_OPTIONS[$index % count(self::MAX_HOURS_OPTIONS)];
            $minHours      = max(0, $maxHours - 10);
            $availableDays = self::DAY_PATTERNS[$index % count(self::DAY_PATTERNS)];

            $inserts[] = [
                'staff_id'           => $staff->id,
                'max_hours_per_week' => $maxHours,
                'min_hours_per_week' => $minHours,
                'available_days'     => json_encode($availableDays),
                'created_at'         => $now,
                'updated_at'         => $now,
            ];
        }

        if (! empty($inserts)) {
            DB::table('staff_constraints')->insert($inserts);
        }

        $this->command->info(
            sprintf('StaffConstraintSeeder: %d 件の勤務制約を登録しました。', count($inserts))
        );
    }
}
