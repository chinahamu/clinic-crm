<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

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
        $ja = FakerFactory::create('ja_JP');
        $totalCount = $ja->randomElement([1, 3, 5, 8, 10]);
        $remainingCount = $ja->numberBetween(0, $totalCount);
        $contractDate = $ja->dateTimeBetween('-1 year', 'now');
        
        return [
            'user_id' => User::factory(),
            'menu_id' => Menu::factory(),
            'clinic_id' => Clinic::factory(),
            'contract_date' => $contractDate,
            'total_count' => $totalCount,
            'remaining_count' => $remainingCount,
            'total_price' => $ja->numberBetween(10000, 500000),
            'expiration_date' => $ja->dateTimeBetween('now', '+1 year'),
            'status' => $ja->randomElement(['active', 'completed', 'cancelled']),
        ];
    }
}
