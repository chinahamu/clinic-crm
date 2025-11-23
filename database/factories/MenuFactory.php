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
        return [
            'name' => $ja->randomElement($menus),
            'description' => $ja->realText(50),
            'price' => $ja->numberBetween(5000, 100000),
            'duration_minutes' => $ja->randomElement([30, 60, 90, 120]),
        ];
    }
}
