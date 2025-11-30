<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Menu>
 */
class MenuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $menus = ['全身脱毛', '顔脱毛', 'VIO脱毛', 'フェイシャル', '痩身エステ', '美肌治療'];
        
        $ja = FakerFactory::create('ja_JP');
        
        $menuTypes = [
            [
                'name' => '医療脱毛（全身）',
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_type' => 'laser',
                'duration_minutes' => 120,
                'price' => 50000,
            ],
            [
                'name' => 'カウンセリング',
                'required_role' => 'counselor',
                'required_room_type' => 'counseling',
                'required_machine_type' => null,
                'duration_minutes' => 60,
                'price' => 0,
            ],
            [
                'name' => '医師診察',
                'required_role' => 'doctor',
                'required_room_type' => 'consultation',
                'required_machine_type' => null,
                'duration_minutes' => 30,
                'price' => 3000,
            ],
            [
                'name' => 'HIFU全顔',
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_type' => 'hifu',
                'duration_minutes' => 60,
                'price' => 30000,
            ],
            [
                'name' => '全身脱毛 5回コース',
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_type' => 'laser',
                'duration_minutes' => 120,
                'price' => 200000,
                'num_tickets' => 5,
                'validity_period_days' => 365,
            ],
            [
                'name' => 'フェイシャル 10回コース',
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_type' => null,
                'duration_minutes' => 60,
                'price' => 80000,
                'num_tickets' => 10,
                'validity_period_days' => 180,
            ],
            [
                'name' => '【期間限定】春の美肌キャンペーン',
                'required_role' => 'nurse',
                'required_room_type' => 'treatment',
                'required_machine_type' => 'laser',
                'duration_minutes' => 90,
                'price' => 15000,
                'campaign_flag' => true,
                'publish_start_at' => now(),
                'publish_end_at' => now()->addMonth(),
            ],
        ];

        $selected = $ja->randomElement($menuTypes);

        $machineId = null;
        if ($selected['required_machine_type']) {
            $machine = \App\Models\Machine::where('type', $selected['required_machine_type'])->inRandomOrder()->first();
            $machineId = $machine ? $machine->id : null;
        }

        return [
            'name' => $selected['name'],
            'description' => $ja->realText(50),
            'price' => $selected['price'],
            'duration_minutes' => $selected['duration_minutes'],
            'required_role' => $selected['required_role'],
            'required_room_type' => $selected['required_room_type'],
            'required_machine_id' => $machineId,
            'num_tickets' => $selected['num_tickets'] ?? null,
            'validity_period_days' => $selected['validity_period_days'] ?? null,
            'campaign_flag' => $selected['campaign_flag'] ?? false,
            'publish_start_at' => $selected['publish_start_at'] ?? null,
            'publish_end_at' => $selected['publish_end_at'] ?? null,
        ];
    }
}
