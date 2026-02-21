<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Staff;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShiftSeeder extends Seeder
{
    /**
     * 過去 2 ヶ月〜未来 1 ヶ月分のシフトを生成する。
     *
     * ルール:
     *   - 日曜除く
     *   - 過去日: 80% の確率でシフトあり
     *   - 未来日: 90% の確率でシフトあり
     *   - 重複たシフトはスキップ（冒等性保証）
     *   - 500件ごとのバルクインサートでパフォーマンス確保
     *
     * 対象テーブル : shifts
     * 前提シーダー : ClinicSeeder, StaffSeeder
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (! $clinic) {
            $this->command->warn('ShiftSeeder: Clinic が見つかりません。');

            return;
        }

        $staffs = Staff::where('clinic_id', $clinic->id)->get();
        if ($staffs->isEmpty()) {
            $this->command->warn('ShiftSeeder: スタッフが存在しません。');

            return;
        }

        $start = Carbon::today()->subMonths(2)->startOfDay();
        $end   = Carbon::today()->addMonth()->endOfDay();

        // 存在シフトを一括取得して重複チェックを高速化
        $existingKeys = DB::table('shifts')
            ->select('staff_id', DB::raw('DATE(start_time) as shift_date'))
            ->get()
            ->map(fn ($r) => $r->staff_id . '_' . $r->shift_date)
            ->flip()
            ->all();

        $inserts = [];
        $now     = now();

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            if ($date->isSunday()) {
                continue;
            }

            $probability = $date->lessThan(Carbon::today()) ? 80 : 90;

            foreach ($staffs as $staff) {
                if (rand(1, 100) > $probability) {
                    continue;
                }

                $key = $staff->id . '_' . $date->toDateString();
                if (isset($existingKeys[$key])) {
                    continue;
                }
                $existingKeys[$key] = true;

                $inserts[] = [
                    'staff_id'   => $staff->id,
                    'clinic_id'  => $clinic->id,
                    'start_time' => $date->copy()->setHour(9)->setMinute(0)->setSecond(0),
                    'end_time'   => $date->copy()->setHour(18)->setMinute(0)->setSecond(0),
                    'status'     => 'scheduled',
                    'location'   => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($inserts, 500) as $chunk) {
            DB::table('shifts')->insert($chunk);
        }

        $this->command->info(
            sprintf('ShiftSeeder: %d 件のシフトを登録しました。', count($inserts))
        );
    }
}
