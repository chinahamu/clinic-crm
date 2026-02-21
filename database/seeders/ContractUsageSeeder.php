<?php

namespace Database\Seeders;

use App\Models\ContractUsage;
use App\Models\Reservation;
use Illuminate\Database\Seeder;

class ContractUsageSeeder extends Seeder
{
    /**
     * completed ステータスの予約を既存の contract_usages に紐付ける。
     *
     * ContractSeeder で reservation_id = null のまま生成された使用履歴に
     * 対応する completed 予約の ID と日付をリンクする。
     *
     * 対象テーブル : contract_usages
     * 前提シーダー : ContractSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $completedReservations = Reservation::where('status', 'completed')
            ->orderBy('start_time')
            ->get();

        if ($completedReservations->isEmpty()) {
            $this->command->warn('ContractUsageSeeder: completed な予約が見つかりません。');

            return;
        }

        $linked = 0;

        foreach ($completedReservations as $reservation) {
            // 同ユーザーの未紐付け使用記録を 1 件取得
            $usage = ContractUsage::whereHas('contract', function ($q) use ($reservation) {
                $q->where('user_id', $reservation->user_id);
            })
                ->whereNull('reservation_id')
                ->first();

            if (! $usage) {
                continue;
            }

            $usage->update([
                'reservation_id' => $reservation->id,
                'used_date'      => $reservation->start_time->toDateString(),
            ]);

            $linked++;
        }

        $this->command->info(
            sprintf(
                'ContractUsageSeeder: %d 件の予約を contract_usages に紐付けました。',
                $linked
            )
        );
    }
}
