<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentTemplate>
 */
class DocumentTemplateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['consent', 'contract', 'questionnaire'];
        $titles = [
            'consent' => ['施術同意書', '麻酔同意書'],
            'contract' => ['契約書', '解約書'],
            'questionnaire' => ['問診票', 'アンケート'],
        ];

        $ja = FakerFactory::create('ja_JP');
        $type = $ja->randomElement($types);
        $title = $ja->randomElement($titles[$type]);

        return [
            'title' => $title,
            'content' => $ja->realText(500),
            'type' => $type,
            'is_active' => true,
        ];
    }
}
