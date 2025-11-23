<?php

namespace Database\Factories;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Factories\Factory;

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

        $type = fake()->randomElement($types);
        $name = fake()->randomElement($names[$type]);

        return [
            'name' => $name,
            'type' => $type,
            'clinic_id' => Clinic::factory(),
        ];
    }
}
