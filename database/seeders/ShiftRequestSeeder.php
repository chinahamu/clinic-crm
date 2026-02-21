<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Staff;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShiftRequestSeeder extends Seeder
{
    /**
     * 各スタッフの翌月シフト希望を登録する。
     *
     * 希望パターン:
     *   各平日 (月〜土) につき 85% の確率でシフト希望を提出。
     *   うち 12% は有休希望 (is_holiday = true)。
     *
     * 対象テーブル : shift_requests
     * 前提シーダー : ClinicSeeder, StaffSeeder
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (! $clinic) {
            $this->command->warn('ShiftRequestSeeder: Clinic が見つかりません。');

            return;
        }

        $staffs = Staff::where('clinic_id', $clinic->id)->get();
        if ($staffs->isEmpty()) {
            $this->command->warn('ShiftRequestSeeder: スタッフが存在しません。');

            return;
        }

        $nextMonthStart = Carbon::today()->addMonth()->startOfMonth();
        $nextMonthEnd   = Carbon::today()->addMonth()->endOfMonth();
        $now            = now();
        $inserts        = [];

        foreach ($staffs as $staff) {
            for ($date = $nextMonthStart->copy(); $date->lte($nextMonthEnd); $date->addDay()) {
                if ($date->isSunday()) {
                    continue;
                }

                // 85% の確率でシフト希望を提出
                if (rand(1, 100) > 85) {
                    continue;
                }

                $isHoliday = rand(1, 100) <= 12; // 12% の確率で有休希望

                $inserts[] = [
                    'staff_id'   => $staff->id,
                    'date'       => $date->toDateString(),
                    'start_time' => $isHoliday ? null : '09:00:00',
                    'end_time'   => $isHoliday ? null : '18:00:00',
                    'is_holiday' => $isHoliday,
                    'note'       => $isHoliday ? '有休申請' : null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($inserts, 500) as $chunk) {
            DB::table('shift_requests')->insert($chunk);
        }

        $this->command->info(
            sprintf(
                'ShiftRequestSeeder: %d 名分の翌月シフト希望 %d 件を登録しました。',
                $staffs->count(),
                count($inserts)
            )
        );
    }
}
