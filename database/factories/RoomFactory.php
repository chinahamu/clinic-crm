<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['consultation', 'treatment', 'counseling', 'waiting'];
        $names = [
            'consultation' => ['診察室1', '診察室2', '診察室3'],
            'treatment' => ['処置室1', '処置室2', '処置室3', 'VIPルーム'],
            'counseling' => ['カウンセリングルーム1', 'カウンセリングルーム2'],
            'waiting' => ['待合室'],
        ];

        $type = fake()->randomElement($types);
        $name = fake()->randomElement($names[$type]);

        return [
            'name' => $name,
            'type' => $type,
            'clinic_id' => Clinic::factory(),
        ];
    }
}
