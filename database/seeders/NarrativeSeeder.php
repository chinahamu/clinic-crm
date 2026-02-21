<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Reservation;
use App\Models\Staff;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NarrativeSeeder extends Seeder
{
    /**
     * 施術記録のサンプルテキスト。
     * completed 予約の内容としてランダムに選択する。
     */
    private const TREATMENT_CONTENTS = [
        '脱毛施術（両わき）を実施。照射出力: 20J/cm²。患者の反応：良好。次回は 4 週間後を推奨。',
        'フォトフェイシャル施術を実施。肝斑・シミへの効果を確認。副作用なし。',
        'ヒアルロン酸注射（鼻）を実施。0.5ml 使用。形状・腑れともに問題なし。',
        'ボトックス注射（點・眉間）を実施。効果発現まで 3〜5 日。',
        'レーザートーニング施術実施。くすみ改善を目標に 5 回コース開始。',
        'ピコレーザー（シミ治療）施術実施。照射後の赤みは 24 時間で消退見込。',
        '高周波 RF 施術（フェイスライン引き締め）を実施。特記事項なし。',
        'ケミカルピーリング（グリコール酸）実施。ターンオーバー促進目的。',
    ];

    /**
     * ライフイベント登録パターン (category / impact_level はテーブル定義に準拠)。
     */
    private const LIFE_EVENT_PATTERNS = [
        ['title' => '結婚式（挙式予定）',          'category' => 'family', 'impact_level' => 3],
        ['title' => '同窓会参加予定',              'category' => 'family', 'impact_level' => 2],
        ['title' => '重要なプレゼン（昇進審査）',  'category' => 'work',   'impact_level' => 2],
        ['title' => 'ビジネスパートナーとの会食',   'category' => 'work',   'impact_level' => 2],
        ['title' => '海外旅行（観光）',                'category' => 'other',  'impact_level' => 2],
        ['title' => '健康診断',                        'category' => 'health', 'impact_level' => 1],
    ];

    /**
     * patient_values に登録する属性定義。
     * UNIQUE(user_id, clinic_id, attribute_name) のため冕等性確保を要確認。
     */
    private const PATIENT_ATTRIBUTES = [
        ['attribute_name' => 'downtime_tolerance', 'score_range' => [1, 5]],
        ['attribute_name' => 'price_sensitivity',  'score_range' => [1, 5]],
        ['attribute_name' => 'visit_frequency',    'score_range' => [1, 5]],
    ];

    /**
     * 3 テーブルを一括シードする。
     *
     * 1. narrative_logs  : completed 予約ごとに施術記録 1 件
     * 2. patient_values  : 全患者に 3 属性スコア（downtime_tolerance / price_sensitivity / visit_frequency）
     * 3. life_events     : 患者の約 40% にライフイベント 1〜2 件
     *
     * 対象テーブル : narrative_logs, patient_values, life_events
     * 前提シーダー : ClinicSeeder, StaffSeeder, PatientSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        if (! $clinic) {
            $this->command->warn('NarrativeSeeder: Clinic が見つかりません。');

            return;
        }

        $defaultStaff = Staff::where('clinic_id', $clinic->id)->first();
        if (! $defaultStaff) {
            $this->command->warn('NarrativeSeeder: スタッフが存在しません。');

            return;
        }

        $now = now();

        // ----------------------------------------------------------------
        // 1. narrative_logs
        // ----------------------------------------------------------------
        $completedReservations = Reservation::where('status', 'completed')->get();
        $narrativeLogs         = [];

        foreach ($completedReservations as $res) {
            $exists = DB::table('narrative_logs')
                ->where('user_id', $res->user_id)
                ->whereDate('created_at', $res->start_time->toDateString())
                ->exists();

            if ($exists) {
                continue;
            }

            $narrativeLogs[] = [
                'user_id'        => $res->user_id,
                'staff_id'       => $res->staff_id ?? $defaultStaff->id,
                'content'        => self::TREATMENT_CONTENTS[array_rand(self::TREATMENT_CONTENTS)],
                'emotional_tags' => json_encode(['安心', '満足']),
                'context'        => '予約#' . $res->id . ' / メニュー#' . $res->menu_id,
                'created_at'     => $res->start_time,
                'updated_at'     => $res->start_time,
            ];
        }

        foreach (array_chunk($narrativeLogs, 500) as $chunk) {
            DB::table('narrative_logs')->insert($chunk);
        }

        // ----------------------------------------------------------------
        // 2. patient_values
        // ----------------------------------------------------------------
        $patients      = User::role('patient')->get();
        $patientValues = [];

        foreach ($patients as $patient) {
            foreach (self::PATIENT_ATTRIBUTES as $attr) {
                $exists = DB::table('patient_values')
                    ->where('user_id', $patient->id)
                    ->where('clinic_id', $clinic->id)
                    ->where('attribute_name', $attr['attribute_name'])
                    ->exists();

                if ($exists) {
                    continue;
                }

                $patientValues[] = [
                    'user_id'        => $patient->id,
                    'clinic_id'      => $clinic->id,
                    'attribute_name' => $attr['attribute_name'],
                    'score'          => rand($attr['score_range'][0], $attr['score_range'][1]),
                    'notes'          => null,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        foreach (array_chunk($patientValues, 500) as $chunk) {
            DB::table('patient_values')->insert($chunk);
        }

        // ----------------------------------------------------------------
        // 3. life_events (患者の約 40%)
        // ----------------------------------------------------------------
        $lifeEvents  = [];
        $sampleCount = max(1, (int) floor($patients->count() * 0.4));
        $sampleCount = min($sampleCount, $patients->count());

        foreach ($patients->random($sampleCount) as $patient) {
            $count = rand(1, 2);
            for ($i = 0; $i < $count; $i++) {
                $pattern      = self::LIFE_EVENT_PATTERNS[array_rand(self::LIFE_EVENT_PATTERNS)];
                $lifeEvents[] = [
                    'user_id'      => $patient->id,
                    'occurred_at'  => Carbon::today()->addMonths(rand(1, 6))->toDateString(),
                    'title'        => $pattern['title'],
                    'category'     => $pattern['category'],
                    'impact_level' => $pattern['impact_level'],
                    'created_at'   => $now,
                    'updated_at'   => $now,
                ];
            }
        }

        foreach (array_chunk($lifeEvents, 500) as $chunk) {
            DB::table('life_events')->insert($chunk);
        }

        $this->command->info(sprintf(
            'NarrativeSeeder: 施術記録 %d 件・患者属性 %d 件・ライフイベント %d 件を登録しました。',
            count($narrativeLogs),
            count($patientValues),
            count($lifeEvents)
        ));
    }
}
