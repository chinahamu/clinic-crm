<?php

namespace Database\Seeders;

use App\Models\Clinic;
use App\Models\Contract;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clinic = Clinic::first();
        $users = User::role('patient')->get();
        // コース料理（チケット付き）のメニューのみを選択する
        $menus = Menu::whereNotNull('num_tickets')->where('num_tickets', '>', 1)->get();

        if ($users->isEmpty() || $menus->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // 0-2契約をユーザーに割り当てる
            $count = rand(0, 2);
            for ($i = 0; $i < $count; $i++) {
                $menu = $menus->random();
                $totalCount = $menu->num_tickets;
                $remainingCount = rand(0, $totalCount);
                $usedCount = $totalCount - $remainingCount;
                
                $contract = Contract::create([
                    'user_id' => $user->id,
                    'menu_id' => $menu->id,
                    'clinic_id' => $clinic->id,
                    'contract_date' => now()->subDays(rand(1, 100)),
                    'total_count' => $totalCount,
                    'remaining_count' => $remainingCount,
                    'total_price' => $menu->price,
                    'expiration_date' => $menu->validity_period_days ? now()->addDays($menu->validity_period_days) : null,
                    'status' => $remainingCount === 0 ? 'completed' : 'active',
                ]);

                // 使用履歴を生成する
                for ($j = 0; $j < $usedCount; $j++) {
                    $contract->usages()->create([
                        'used_count' => 1,
                        'used_date' => now()->subDays(rand(1, 90)),
                    ]);
                }
            }
        }
    }
}
