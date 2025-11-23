<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = ['化粧水', '乳液', '美容液', '日焼け止め', 'サプリメント', 'フェイスマスク'];
        
        return [
            'name' => fake()->randomElement($products) . ' ' . fake()->word(),
            'price' => fake()->numberBetween(1000, 20000),
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}
