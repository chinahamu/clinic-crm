<?php

namespace Database\Seeders;

use App\Models\Consumable;
use App\Models\Medicine;
use App\Models\Stock;
use Illuminate\Database\Seeder;

class MedicineAndConsumableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 薬剤のダミーデータ
        $medicines = [
            [
                'name' => 'ロキソニン',
                'description' => '鎮痛剤',
                'unit' => '錠',
                'stock' => 100,
                'alert_threshold' => 20,
            ],
            [
                'name' => 'カロナール',
                'description' => '解熱鎮痛剤',
                'unit' => '錠',
                'stock' => 50,
                'alert_threshold' => 10,
            ],
            [
                'name' => 'ヒアルロン酸注射液',
                'description' => '美容注射用',
                'unit' => '本',
                'stock' => 20,
                'alert_threshold' => 5,
            ],
            [
                'name' => 'ボトックス',
                'description' => 'しわ取り用',
                'unit' => '単位',
                'stock' => 200,
                'alert_threshold' => 50,
            ],
            [
                'name' => 'ビタミンC点滴液',
                'description' => '高濃度ビタミンC',
                'unit' => '袋',
                'stock' => 30,
                'alert_threshold' => 5,
            ],
        ];

        foreach ($medicines as $data) {
            $medicine = Medicine::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'unit' => $data['unit'],
                'alert_threshold' => $data['alert_threshold'],
            ]);

            // 在庫登録
            $medicine->stock()->create([
                'quantity' => $data['stock'],
            ]);
        }

        // 消耗品のダミーデータ
        $consumables = [
            [
                'name' => '滅菌ガーゼ',
                'description' => '処置用ガーゼ',
                'category' => '衛生用品',
                'unit' => '枚',
                'stock' => 500,
                'alert_threshold' => 100,
            ],
            [
                'name' => '注射針 30G',
                'description' => '極細注射針',
                'category' => '医療機器',
                'unit' => '本',
                'stock' => 1000,
                'alert_threshold' => 200,
            ],
            [
                'name' => '使い捨て手袋 M',
                'description' => 'ラテックスフリー',
                'category' => '衛生用品',
                'unit' => '箱',
                'stock' => 50,
                'alert_threshold' => 10,
            ],
            [
                'name' => 'アルコール綿',
                'description' => '消毒用',
                'category' => '衛生用品',
                'unit' => '包',
                'stock' => 300,
                'alert_threshold' => 50,
            ],
            [
                'name' => 'フェイスシート',
                'description' => '施術ベッド用',
                'category' => '備品',
                'unit' => '枚',
                'stock' => 200,
                'alert_threshold' => 30,
            ],
        ];

        foreach ($consumables as $data) {
            $consumable = Consumable::create([
                'name' => $data['name'],
                'description' => $data['description'],
                'category' => $data['category'],
                'unit' => $data['unit'],
                'alert_threshold' => $data['alert_threshold'],
            ]);

            // 在庫登録
            $consumable->stock()->create([
                'quantity' => $data['stock'],
            ]);
        }
    }
}
