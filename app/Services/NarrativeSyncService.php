<?php

namespace App\Services;

use App\Models\User;
use App\Models\PatientValue;
use App\Models\LifeEvent;
use App\Models\NarrativeLog;
use Carbon\Carbon;

class NarrativeSyncService
{
    /**
     * Sync interview answers to narrative profile (PatientValues, LifeEvents, NarrativeLogs).
     *
     * @param User $patient
     * @param array $answers  Key-value pair of question_id => answer
     * @param array $questionsSchema  The 'questions' JSON array from the template
     * @return void
     */
    public function syncFromInterview(User $patient, array $answers, array $questionsSchema)
    {
        // Index questions by ID for easy lookup if needed (though we loop schema mainly)
        $questionsById = collect($questionsSchema)->keyBy('id');

        foreach ($questionsSchema as $question) {
            $qId = $question['id'];
            
            // Skip if no answer provided for this question
            if (!isset($answers[$qId]) || $answers[$qId] === null || $answers[$qId] === '') {
                continue;
            }

            $answerValue = $answers[$qId];
            $mapping = $question['narrative_mapping'] ?? null;

            if (!$mapping) {
                continue;
            }

            $target = $mapping['target'] ?? null;

            if ($target === 'patient_value') {
                $this->syncPatientValue($patient, $answerValue, $mapping);
            } elseif ($target === 'life_event') {
                $this->syncLifeEvent($patient, $answerValue, $mapping, $answers);
            } elseif ($target === 'narrative_log') {
                $this->syncNarrativeLog($patient, $answerValue, $mapping, $question);
            }
        }
    }

    protected function syncPatientValue(User $patient, $value, array $mapping)
    {
        $attribute = $mapping['attribute'] ?? null;
        if (!$attribute) return;

        // Ensure value is numeric for slider/range types if expected, or just store as is.
        // The prompt says "PatientValue: score", implying numeric for sliders, but could be text?
        // Let's assume generic storage. If strictly score, we might cast to int.
        // Prompt validation note: "Service side type cast and check".
        
        // If it looks like a number, cast it? Or just store. 
        // PatientValue model has 'score' column. Assuming it's integer or float.
        // Let's force int if it's numeric, to be safe.
        $score = is_numeric($value) ? (int)$value : 0; 

        PatientValue::updateOrCreate(
            [
                'user_id' => $patient->id,
                'attribute_name' => $attribute,
            ],
            [
                'score' => $score,
                // 'notes' => 'From Web Interview', // Optional, if we want to track source
            ]
        );
    }

    protected function syncLifeEvent(User $patient, $value, array $mapping, array $allAnswers)
    {
        // Value is expected to be a date string
        try {
            $date = Carbon::parse($value);
        } catch (\Exception $e) {
            return; // Invalid date
        }

        $title = $mapping['title_fixed'] ?? 'Event';

        // dynamic title from another question
        if (isset($mapping['title_source'])) {
            $sourceQId = $mapping['title_source'];
            if (!empty($allAnswers[$sourceQId])) {
                $title = $allAnswers[$sourceQId];
            }
        }

        LifeEvent::create([
            'user_id' => $patient->id,
            'occurred_at' => $date,
            'title' => $title,
            'category' => 'personal', // Default
            'impact_level' => 3, // Default medium
        ]);
    }

    protected function syncNarrativeLog(User $patient, $value, array $mapping, array $question)
    {
        // Value is the text content
        if (!is_string($value)) {
            $value = (string)$value;
        }

        NarrativeLog::create([
            'user_id' => $patient->id,
            'content' => $value,
            'context' => 'web_interview',
            // 'emotional_tags' => [], // Optional
        ]);
    }
}
