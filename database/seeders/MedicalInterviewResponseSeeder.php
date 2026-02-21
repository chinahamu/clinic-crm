<?php

namespace Database\Seeders;

use App\Models\MedicalInterviewTemplate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicalInterviewResponseSeeder extends Seeder
{
    /**
     * 問診票回答サンプルデータ。
     * q3 (テキスト) の回答候補一覧。
     */
    private const SKIN_CONCERNS = [
        'シミやそばかすが気になります',
        '毛穴の開きと皮脂分泌が悩みです',
        'ハリとツヤを取り戻したいです',
        'ニキビ跡や色素沈着のケアがしたいです',
        '目の周りのちりめんじわが目立ってきました',
        '肝斑が気になっています',
        '乾燥と敏感肌のケアを相談したいです',
        '首やデコルテのシワが悩みです',
    ];

    /**
     * 各患者の初回予約（最も古い start_time）に問診票回答を 1 件付与する。
     *
     * answers JSON構造: MedicalInterviewTemplateSeeder のテンプレートに対応
     *   q1 (range 1-5): ダウンタイム許容度
     *   q2 (date)     : 重要な予定日
     *   q3 (text)     : スキンの悩み
     *
     * 対象テーブル : medical_interview_responses
     * 前提シーダー : MedicalInterviewTemplateSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $template = MedicalInterviewTemplate::first();
        if (! $template) {
            $this->command->warn('MedicalInterviewResponseSeeder: 問診テンプレートが存在しません。');

            return;
        }

        // 各患者の初回予約（confirmed または completed の後定最古）を取得
        $patients = User::role('patient')
            ->with([
                'reservations' => fn ($q) => $q
                    ->whereIn('status', ['confirmed', 'completed'])
                    ->orderBy('start_time')
                    ->limit(1),
            ])
            ->get();

        if ($patients->isEmpty()) {
            $this->command->warn('MedicalInterviewResponseSeeder: 患者が存在しません。');

            return;
        }

        $now     = now();
        $inserts = [];

        foreach ($patients as $patient) {
            $firstReservation = $patient->reservations->first();
            if (! $firstReservation) {
                continue;
            }

            // 冕等性: 既に回答が存在する場合はスキップ
            $exists = DB::table('medical_interview_responses')
                ->where('reservation_id', $firstReservation->id)
                ->exists();

            if ($exists) {
                continue;
            }

            $inserts[] = [
                'reservation_id' => $firstReservation->id,
                'template_id'    => $template->id,
                'answers'        => json_encode([
                    ['id' => 'q1', 'value' => rand(1, 5)],
                    ['id' => 'q2', 'value' => Carbon::today()->addMonths(rand(1, 6))->toDateString()],
                    ['id' => 'q3', 'value' => self::SKIN_CONCERNS[array_rand(self::SKIN_CONCERNS)]],
                ]),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach (array_chunk($inserts, 200) as $chunk) {
            DB::table('medical_interview_responses')->insert($chunk);
        }

        $this->command->info(
            sprintf('MedicalInterviewResponseSeeder: %d 件の問診票回答を登録しました。', count($inserts))
        );
    }
}
