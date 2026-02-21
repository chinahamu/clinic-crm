<?php

namespace Database\Seeders;

use App\Models\Consumable;
use App\Models\Medicine;
use App\Models\Reservation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReservationItemSeeder extends Seeder
{
    /**
     * completed ステータスの予約に使用薬剤・消耗品の記録を付与する。
     *
     * - 各 completed 予約に 1〜3 件の使用記録を挿入
     * - item_type は Medicine::class または Consumable::class
     *   (MenuItemSeeder と同じパターン)
     *
     * 対象テーブル : reservation_items
     * 前提シーダー : MedicineAndConsumableSeeder, ReservationSeeder
     */
    public function run(): void
    {
        $completedReservations = Reservation::where('status', 'completed')->get();

        if ($completedReservations->isEmpty()) {
            $this->command->warn('ReservationItemSeeder: completed な予約が存在しません。');

            return;
        }

        $medicines   = Medicine::all();
        $consumables = Consumable::all();

        // [モデル, クラス名] のペアコレクション
        $allItems = $medicines->map(fn ($m) => [$m, Medicine::class])
            ->concat($consumables->map(fn ($c) => [$c, Consumable::class]));

        if ($allItems->isEmpty()) {
            $this->command->warn('ReservationItemSeeder: 薬剤・消耗品が存在しません。');

            return;
        }

        $now     = now();
        $inserts = [];

        foreach ($completedReservations as $reservation) {
            $count       = min(rand(1, 3), $allItems->count());
            $pickedItems = $allItems->random($count);

            // random(単数) を返す場合に備えてコレクション化
            if (! ($pickedItems instanceof Collection)) {
                $pickedItems = collect([$pickedItems]);
            }

            foreach ($pickedItems as [$model, $type]) {
                $inserts[] = [
                    'reservation_id' => $reservation->id,
                    'item_id'        => $model->id,
                    'item_type'      => $type,
                    'quantity'       => rand(1, 3),
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        foreach (array_chunk($inserts, 500) as $chunk) {
            DB::table('reservation_items')->insert($chunk);
        }

        $this->command->info(
            sprintf(
                'ReservationItemSeeder: %d 件の予約に %d 件の使用記録を登録しました。',
                $completedReservations->count(),
                count($inserts)
            )
        );
    }
}
