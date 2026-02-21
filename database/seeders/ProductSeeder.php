<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * デモ・テスト用の物販商品データを登録し、
     * 各メニューに 1〜3 件の商品を紐付ける。
     *
     * 対象テーブル: products, menu_product
     */
    public function run(): void
    {
        // ----------------------------------------------------------------
        // 1. 固定デモ商品データ（美容クリニック向け 8 品目）
        // ----------------------------------------------------------------
        $products = [
            [
                'name'        => 'プレミアム美容液 100mL',
                'description' => '高濃度ヒアルロン酸配合。施術後の保湿ケアに最適。',
                'price'       => 8800,
                'stock'       => 45,
                'threshold'   => 10,
                'is_active'   => true,
            ],
            [
                'name'        => 'SPF50 日焼け止めクリーム 30g',
                'description' => 'レーザー・光治療後の必須 UV ケア。無香料・無着色。',
                'price'       => 3300,
                'stock'       => 80,
                'threshold'   => 15,
                'is_active'   => true,
            ],
            [
                'name'        => 'フェイスマスク（施術後専用）10 枚入',
                'description' => '施術直後の鎮静・保湿に特化したシートマスク。',
                'price'       => 5500,
                'stock'       => 60,
                'threshold'   => 10,
                'is_active'   => true,
            ],
            [
                'name'        => 'ホワイトニングサプリメント 30 日分',
                'description' => 'ビタミン C 高配合。内側からの美白ケアをサポート。',
                'price'       => 4400,
                'stock'       => 35,
                'threshold'   => 8,
                'is_active'   => true,
            ],
            [
                'name'        => 'コラーゲンドリンク 10 本セット',
                'description' => 'フィッシュコラーゲン 10,000mg 配合。術後の肌再生をサポート。',
                'price'       => 6600,
                'stock'       => 25,
                'threshold'   => 5,
                'is_active'   => true,
            ],
            [
                'name'        => '低刺激保湿乳液 50mL',
                'description' => '敏感肌向け低刺激乳液。脱毛・フォト後のアフターケアに。',
                'price'       => 2750,
                'stock'       => 70,
                'threshold'   => 15,
                'is_active'   => true,
            ],
            [
                'name'        => 'クレンジングオイル 120mL',
                'description' => 'ノンコメドジェニックテスト済。施術前後の肌に優しいメイク落とし。',
                'price'       => 2200,
                'stock'       => 90,
                'threshold'   => 20,
                'is_active'   => true,
            ],
            [
                'name'        => 'ナイアシンアミドセラム 30mL',
                'description' => 'シミ・くすみへの集中ケア。トーンアップ美容液。',
                'price'       => 9900,
                'stock'       => 20,
                'threshold'   => 5,
                'is_active'   => true,
            ],
        ];

        foreach ($products as $data) {
            Product::firstOrCreate(
                ['name' => $data['name']],
                $data
            );
        }

        // ----------------------------------------------------------------
        // 2. menu_product 中間テーブルへの紐付け
        //    各メニューに 1〜3 商品をランダム紐付け（UNIQUE 重複チェック済）
        // ----------------------------------------------------------------
        $menus    = Menu::all();
        $allProds = Product::all();

        if ($menus->isEmpty() || $allProds->isEmpty()) {
            $this->command->warn('ProductSeeder: Menu または Product が空のため menu_product 紐付けをスキップしました。');

            return;
        }

        $inserts = [];
        // 既存の紐付けを一括取得して重複チェックを高速化
        $existing = DB::table('menu_product')
            ->get(['menu_id', 'product_id'])
            ->map(fn ($r) => $r->menu_id . '_' . $r->product_id)
            ->flip()
            ->all();

        foreach ($menus as $menu) {
            $count          = min(rand(1, 3), $allProds->count());
            $pickedProducts = $allProds->random($count);

            foreach ($pickedProducts as $product) {
                $key = $menu->id . '_' . $product->id;
                if (isset($existing[$key])) {
                    continue;
                }
                $existing[$key] = true;
                $inserts[]      = [
                    'menu_id'    => $menu->id,
                    'product_id' => $product->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (! empty($inserts)) {
            DB::table('menu_product')->insert($inserts);
        }

        $this->command->info(
            sprintf(
                'ProductSeeder: 商品 %d 件、menu_product 紐付け %d 件を登録しました。',
                Product::count(),
                count($inserts)
            )
        );
    }
}
