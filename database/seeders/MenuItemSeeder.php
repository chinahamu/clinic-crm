<?php

namespace Database\Seeders;

use App\Models\Consumable;
use App\Models\Medicine;
use App\Models\Menu;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // メニューを取得（なければ作成）
        $menus = Menu::all();
        
        if ($menus->isEmpty()) {
            $this->call(MenuSeeder::class);
            $menus = Menu::all();
        }

        // 薬剤と消耗品を取得
        $medicines = Medicine::all();
        $consumables = Consumable::all();

        if ($medicines->isEmpty() || $consumables->isEmpty()) {
            $this->call(MedicineAndConsumableSeeder::class);
            $medicines = Medicine::all();
            $consumables = Consumable::all();
        }

        // 各メニューにランダムに薬剤と消耗品を紐付け
        foreach ($menus as $menu) {
            // 既存の紐付けをクリア
            $menu->items()->delete();

            // 薬剤を1-2個紐付け
            $randomMedicines = $medicines->random(min(2, $medicines->count()));
            foreach ($randomMedicines as $medicine) {
                $menu->items()->create([
                    'item_id' => $medicine->id,
                    'item_type' => Medicine::class,
                    'quantity' => rand(1, 5),
                ]);
            }

            // 消耗品を1-3個紐付け
            $randomConsumables = $consumables->random(min(3, $consumables->count()));
            foreach ($randomConsumables as $consumable) {
                $menu->items()->create([
                    'item_id' => $consumable->id,
                    'item_type' => Consumable::class,
                    'quantity' => rand(1, 10),
                ]);
            }
        }
    }
}
