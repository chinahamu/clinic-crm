<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Staff>
 */
class StaffFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ja = FakerFactory::create('ja_JP');
        $phone = $ja->numerify('0##-####-####');

        return [
            'name' => $ja->name(),
            'email' => $ja->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'clinic_id' => Clinic::factory(),
        ];
    }
}
