<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContractUsage>
 */
class ContractUsageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contract_id' => Contract::factory(),
            'reservation_id' => Reservation::factory(),
            'used_count' => 1,
            'used_date' => fake()->date(),
            'notes' => fake()->realText(50),
        ];
    }
}
