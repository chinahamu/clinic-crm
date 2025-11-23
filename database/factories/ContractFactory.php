<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contract>
 */
class ContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalCount = fake()->randomElement([1, 3, 5, 8, 10]);
        $remainingCount = fake()->numberBetween(0, $totalCount);
        $contractDate = fake()->dateTimeBetween('-1 year', 'now');
        
        return [
            'user_id' => User::factory(),
            'menu_id' => Menu::factory(),
            'clinic_id' => Clinic::factory(),
            'contract_date' => $contractDate,
            'total_count' => $totalCount,
            'remaining_count' => $remainingCount,
            'total_price' => fake()->numberBetween(10000, 500000),
            'expiration_date' => fake()->dateTimeBetween('now', '+1 year'),
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
        ];
    }
}
