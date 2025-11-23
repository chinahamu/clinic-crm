<?php

namespace Database\Factories;

use App\Models\Clinic;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shift>
 */
class ShiftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ja = FakerFactory::create('ja_JP');
        $startTime = $ja->dateTimeBetween('now', '+1 month');
        $endTime = (clone $startTime)->modify('+9 hours');

        return [
            'staff_id' => Staff::factory(),
            'clinic_id' => Clinic::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => 'scheduled',
            'location' => $ja->randomElement(['東京本院', '大阪院', '名古屋院']),
        ];
    }
}
