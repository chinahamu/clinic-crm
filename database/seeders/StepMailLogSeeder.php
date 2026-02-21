<?php

namespace Database\Seeders;

use App\Models\MailScenario;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StepMailLogSeeder extends Seeder
{
    /**
     * 3 シナリオのステップメールログを生成する。
     *
     * 1. after_first_visit : 初回 completed 予約の +3日後に送信（各患者 1 件）
     * 2. after_visit       : 全 completed 予約の +30日後に送信
     * 3. no_visit_60d      : last_visit_at が 60日以上前の休眠患者に当日送信予定
     *
     * status 決定ルール:
     *   scheduled_at < now() → 'sent'
     *   scheduled_at >= now() → 'scheduled'
     *
     * 対象テーブル : step_mail_logs
     * 前提シーダー : DefaultScenariosSeeder, PatientSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $scenarios = MailScenario::all()->keyBy('trigger_type');

        if ($scenarios->isEmpty()) {
            $this->command->warn('StepMailLogSeeder: MailScenario が存在しません。DefaultScenariosSeeder を先に実行してください。');

            return;
        }

        $now     = now();
        $inserts = [];

        // ----------------------------------------------------------------
        // 1. after_first_visit
        // ----------------------------------------------------------------
        $afterFirstVisit = $scenarios->get('after_first_visit');
        if ($afterFirstVisit) {
            $patients = User::role('patient')->get();

            foreach ($patients as $patient) {
                $firstCompleted = Reservation::where('user_id', $patient->id)
                    ->where('status', 'completed')
                    ->orderBy('start_time')
                    ->first();

                if (! $firstCompleted) {
                    continue;
                }

                $scheduledAt = Carbon::parse($firstCompleted->start_time)
                    ->addDays($afterFirstVisit->days_offset);

                $exists = DB::table('step_mail_logs')
                    ->where('user_id', $patient->id)
                    ->where('mail_type', 'after_first_visit')
                    ->exists();

                if ($exists) {
                    continue;
                }

                $inserts[] = [
                    'user_id'          => $patient->id,
                    'reservation_id'   => $firstCompleted->id,
                    'mail_type'        => 'after_first_visit',
                    'mail_scenario_id' => $afterFirstVisit->id,
                    'scheduled_at'     => $scheduledAt,
                    'status'           => $scheduledAt->isPast() ? 'sent' : 'scheduled',
                    'sent_at'          => $scheduledAt,
                    'channel'          => 'email',
                    'rendered_message' => $this->render($afterFirstVisit->body, $patient, $firstCompleted),
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ];
            }
        }

        // ----------------------------------------------------------------
        // 2. after_visit
        // ----------------------------------------------------------------
        $afterVisit = $scenarios->get('after_visit');
        if ($afterVisit) {
            $completedReservations = Reservation::where('status', 'completed')
                ->with(['user', 'menu'])
                ->get();

            foreach ($completedReservations as $res) {
                $scheduledAt = Carbon::parse($res->start_time)
                    ->addDays($afterVisit->days_offset);

                $exists = DB::table('step_mail_logs')
                    ->where('user_id', $res->user_id)
                    ->where('reservation_id', $res->id)
                    ->where('mail_type', 'after_visit')
                    ->exists();

                if ($exists) {
                    continue;
                }

                $inserts[] = [
                    'user_id'          => $res->user_id,
                    'reservation_id'   => $res->id,
                    'mail_type'        => 'after_visit',
                    'mail_scenario_id' => $afterVisit->id,
                    'scheduled_at'     => $scheduledAt,
                    'status'           => $scheduledAt->isPast() ? 'sent' : 'scheduled',
                    'sent_at'          => $scheduledAt,
                    'channel'          => 'email',
                    'rendered_message' => $this->render($afterVisit->body, $res->user, $res),
                    'created_at'       => $now,
                    'updated_at'       => $now,
                ];
            }
        }

        // ----------------------------------------------------------------
        // 3. no_visit_60d — last_visit_at が 60 日以上前の休眠患者
        // ----------------------------------------------------------------
        $noVisit60 = $scenarios->get('no_visit_60d');
        if ($noVisit60) {
            $cutoff       = Carbon::today()->subDays(60);
            $dormantUsers = User::role('patient')
                ->whereNotNull('last_visit_at')
                ->where('last_visit_at', '<', $cutoff)
                ->get();

            foreach ($dormantUsers as $patient) {
                $exists = DB::table('step_mail_logs')
                    ->where('user_id', $patient->id)
                    ->where('mail_type', 'no_visit_60d')
                    ->exists();

                if ($exists) {
                    continue;
                }

                $scheduledAt = Carbon::today();

                $inserts[] = [
                    'user_id'          => $patient->id,
                    'reservation_id'   => null,
                    'mail_type'        => 'no_visit_60d',
                    'mail_scenario_id' => $noVisit60->id,
                    'scheduled_at'     => $scheduledAt,
                    'status'           => 'scheduled',
                    'sent_at'          => $scheduledAt,
                    'channel'          => 'email',
                    'rendered_message' => str_replace(
                        ['{{\u60a3\u8005\u540d}}', '{{\u30af\u30ea\u30cb\u30c3\u30af\u540d}}'],
                        [$patient->name, '\u30c7\u30e2\u30af\u30ea\u30cb\u30c3\u30af'],
                        $noVisit60->body
                    ),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($inserts, 500) as $chunk) {
            DB::table('step_mail_logs')->insert($chunk);
        }

        $this->command->info(
            sprintf('StepMailLogSeeder: %d 件のステップメールログを登録しました。', count($inserts))
        );
    }

    /**
     * メール本文のテンプレート変数をデモ値で展開する。
     */
    private function render(string $body, ?object $user, ?object $reservation): string
    {
        $menuName = null;
        if ($reservation && isset($reservation->menu)) {
            $menuName = $reservation->menu?->name;
        }

        return str_replace(
            ['{{\u60a3\u8005\u540d}}', '{{\u656c\u79f0}}', '{{\u6765\u9662\u65e5}}', '{{\u30e1\u30cb\u30e5\u30fc\u540d}}', '{{\u30af\u30ea\u30cb\u30c3\u30af\u540d}}'],
            [
                $user?->name ?? '\u30b2\u30b9\u30c8',
                '\u3055\u307e',
                $reservation ? Carbon::parse($reservation->start_time)->format('Y\u5e74m\u6708d\u65e5') : '',
                $menuName ?? '',
                '\u30c7\u30e2\u30af\u30ea\u30cb\u30c3\u30af',
            ],
            $body
        );
    }
}
