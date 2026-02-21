<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Consumable;
use App\Models\Medicine;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    /**
     * MedicineAndConsumableSeeder で生成済みの在庫レコードに対して以下を行う。
     *
     * 1. clinic_id の付与（MedicineAndConsumableSeeder では未設定）
     * 2. デモ用アラートシナリオ:薬剤 2 件・消耗品 1 件を意図的に閘値未満に設定
     *
     * 対象テーブル : stocks
     * 前提シーダー: ClinicSeeder, MedicineAndConsumableSeeder
     *
     * アラートシナリオ一覧:
     *   - 薬剤「ロキソニン」  閘値:20  → 在庫: 8
     *   - 薬剤「カロナール」  閘値:10  → 在庫: 4
     *   - 消耗品「注射針 30G」 閘値:200 → 在庫: 80
     */
    public function run(): void
    {
        $clinic = Clinic::first();

        if (! $clinic) {
            $this->command->warn('StockSeeder: Clinic が見つかりません。スキップします。');

            return;
        }

        // ----------------------------------------------------------------
        // 1. clinic_id 未設定の在庫全件に clinic_id を付与
        // ----------------------------------------------------------------
        $updated = Stock::whereNull('clinic_id')->update(['clinic_id' => $clinic->id]);
        $this->command->info("StockSeeder: {$updated} 件の在庫に clinic_id を設定しました。");

        // ----------------------------------------------------------------
        // 2. デモ用アラートシナリオの設定
        //    薬剤上位 2 件（ロキソニン・カロナール）を閘値未満に設定
        // ----------------------------------------------------------------
        $this->setAlertStock(
            '薬剤',
            Medicine::orderBy('id')->limit(2)->get()
        );

        // 消耗品は 2 番目（注射針 30G）をアラート対象にする
        $this->setAlertStock(
            '消耗品',
            Consumable::orderBy('id')->skip(1)->limit(1)->get()
        );

        $this->command->info(
            sprintf(
                'StockSeeder: 完了。総在庫 %d 件（アラート状態 3 件を含む）',
                Stock::count()
            )
        );
    }

    /**
     * 対象モデルコレクションの在庫を alert_threshold の 40%未満に設定してアラートを発火させる。
     *
     * @param  string      $label   ログ出力用ラベル（薬剤 / 消耗品）
     * @param  Collection  $models
     */
    private function setAlertStock(string $label, Collection $models): void
    {
        foreach ($models as $model) {
            $threshold = $model->alert_threshold ?? 5;
            $alertQty  = max(1, (int) floor($threshold * 0.4));

            // morphOne リレーション経由で Stock を取得
            /** @var Stock|null $stock */
            $stock = $model->stock;

            if (! $stock) {
                $this->command->warn("  [SKIP] {$label}「{$model->name}」の在庫レコードが見つかりません。");
                continue;
            }

            $stock->update(['quantity' => $alertQty]);

            $this->command->warn(
                sprintf(
                    '  [⚠️ アラート] %s「%s」 在庫: %d / 閘値: %d',
                    $label,
                    $model->name,
                    $alertQty,
                    $threshold
                )
            );
        }
    }
}
