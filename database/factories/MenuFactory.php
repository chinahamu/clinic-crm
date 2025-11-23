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
        ];

        $selected = $ja->randomElement($menuTypes);

        return [
            'name' => $selected['name'],
            'description' => $ja->realText(50),
            'price' => $selected['price'],
            'duration_minutes' => $selected['duration_minutes'],
            'required_role' => $selected['required_role'],
            'required_room_type' => $selected['required_room_type'],
            'required_machine_type' => $selected['required_machine_type'],
        ];
    }
}
