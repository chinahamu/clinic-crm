<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\DocumentTemplate;
use App\Models\Reservation;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SignedDocument>
 */
class SignedDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'document_template_id' => DocumentTemplate::factory(),
            'staff_id' => Staff::factory(),
            'reservation_id' => Reservation::factory(),
            'contract_id' => Contract::factory(),
            'signed_content' => fake()->realText(500),
            'signature_image_path' => 'signatures/demo.png',
            'signed_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
