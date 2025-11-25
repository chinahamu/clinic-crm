<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Machine>
 */
class MachineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['laser', 'ipl', 'hifu', 'ems'];
        $names = [
            'laser' => ['アレキサンドライトレーザー', 'ダイオードレーザー', 'ヤグレーザー'],
            'ipl' => ['光治療器A', '光治療器B'],
            'hifu' => ['HIFU機器プロ', 'HIFU機器スタンダード'],
            'ems' => ['EMSボディ', 'EMSフェイス'],
        ];

        $ja = FakerFactory::create('ja_JP');
        $type = $ja->randomElement($types);
        $name = $ja->randomElement($names[$type]);

        return [
            'name' => $name,
            'type' => $type,
            'quantity' => $this->faker->numberBetween(1, 5),
            'clinic_id' => Clinic::factory(),
        ];
    }
}
