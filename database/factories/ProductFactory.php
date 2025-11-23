<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

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
        $ja = FakerFactory::create('ja_JP');
        $products = ['化粧水', '乳液', '美容液', '日焼け止め', 'サプリメント', 'フェイスマスク'];

        return [
            'name' => $ja->randomElement($products) . ' ' . $ja->word(),
            'price' => $ja->numberBetween(1000, 20000),
            'stock' => $ja->numberBetween(0, 100),
        ];
    }
}
