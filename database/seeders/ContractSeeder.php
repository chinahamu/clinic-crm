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
        $menus = Menu::all();

        if ($users->isEmpty() || $menus->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            // Create 1-3 contracts per user
            $count = rand(1, 3);
            for ($i = 0; $i < $count; $i++) {
                Contract::factory()->create([
                    'user_id' => $user->id,
                    'menu_id' => $menus->random()->id,
                    'clinic_id' => $clinic->id,
                ]);
            }
        }
    }
}
