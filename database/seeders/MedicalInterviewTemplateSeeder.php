<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalInterviewTemplate;

class MedicalInterviewTemplateSeeder extends Seeder
{
    public function run()
    {
        MedicalInterviewTemplate::create([
            'name' => '美容皮膚科・初診ヒアリング',
            'questions' => [
                [
                    'id' => 'q1',
                    'type' => 'range',
                    'label' => 'ダウンタイム（施術後の赤みや腫れ）について',
                    'options' => [
                        'min' => 1,
                        'max' => 5,
                        'minLabel' => '許容できない',
                        'maxLabel' => '効果優先で許容',
                    ],
                    'narrative_mapping' => [
                        'target' => 'patient_value',
                        'attribute' => 'downtime_tolerance',
                    ],
                ],
                [
                    'id' => 'q2',
                    'type' => 'date',
                    'label' => '直近で人前に出る大切な予定はありますか？',
                    'narrative_mapping' => [
                        'target' => 'life_event',
                        'title_fixed' => '重要な予定', // Using fixed title strategy
                    ],
                ],
                [
                    'id' => 'q3',
                    'type' => 'text',
                    'label' => '現在のお肌の悩みで、一番解決したいことは？',
                    'narrative_mapping' => [
                        'target' => 'narrative_log',
                    ],
                ],
            ],
        ]);
    }
}
