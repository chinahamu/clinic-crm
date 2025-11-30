<?php

namespace App\Services;

use App\Models\Shift;
use App\Models\ShiftRequest;
use App\Models\Staff;
use App\Models\StaffConstraint;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShiftGenerationService
{
    protected $apiKey;
    protected $model = 'gemini-2.0-flash';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key') ?? env('GEMINI_API_KEY');
    }

    public function generate(Carbon $start, Carbon $end)
    {
        $data = $this->gatherData($start, $end);
        $prompt = $this->buildPrompt($data, $start, $end);
        $response = $this->callGemini($prompt);
        
        return $this->parseResponse($response);
    }

    protected function gatherData(Carbon $start, Carbon $end)
    {
        $staff = Staff::with(['constraints'])->get();
        $requests = ShiftRequest::whereBetween('date', [$start, $end])->get();
        
        // Existing shifts (to avoid duplicates or conflicts if re-generating?)
        // For now, we assume we are generating for a blank slate or overwriting.
        
        return [
            'staff' => $staff,
            'requests' => $requests,
        ];
    }

    protected function buildPrompt($data, Carbon $start, Carbon $end)
    {
        $staffData = $data['staff']->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'constraints' => $s->constraints,
            ];
        });

        $requestData = $data['requests']->map(function ($r) {
            return [
                'staff_id' => $r->staff_id,
                'date' => $r->date->toDateString(),
                'start_time' => $r->start_time ? Carbon::parse($r->start_time)->format('H:i') : null,
                'end_time' => $r->end_time ? Carbon::parse($r->end_time)->format('H:i') : null,
                'is_holiday' => $r->is_holiday,
                'note' => $r->note,
            ];
        });

        $startDate = $start->toDateString();
        $endDate = $end->toDateString();

        return <<<EOT
You are an expert shift scheduler. Create a shift schedule for a clinic from {$startDate} to {$endDate}.

**Constraints & Rules:**
1.  **Staff Availability**: Respect `staff_constraints` (max/min hours, available days).
2.  **Shift Requests**: Prioritize `shift_requests`. If `is_holiday` is true, do NOT schedule. If times are specified, try to match them.
3.  **Coverage**: Ensure at least 2 staff members are present between 09:00 and 18:00 every day.
4.  **Format**: Return ONLY a valid JSON array of objects. No markdown, no explanations.

**Input Data:**
Staff:
{$staffData->toJson()}

Requests:
{$requestData->toJson()}

**Output Format (JSON Array):**
[
    {
        "staff_id": 1,
        "date": "2023-10-01",
        "start_time": "09:00",
        "end_time": "18:00"
    },
    ...
]
EOT;
    }

    protected function callGemini($prompt)
    {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $response = Http::post($url, [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.2,
                'responseMimeType' => 'application/json',
            ]
        ]);

        if ($response->failed()) {
            Log::error('Gemini API Error', $response->json());
            throw new \Exception('Failed to generate shifts via Gemini.');
        }

        return $response->json();
    }

    protected function parseResponse($response)
    {
        try {
            $text = $response['candidates'][0]['content']['parts'][0]['text'];
            // Clean up markdown code blocks if present (though responseMimeType should handle it)
            $text = str_replace(['```json', '```'], '', $text);
            
            return json_decode($text, true);
        } catch (\Exception $e) {
            Log::error('Gemini Parse Error', ['response' => $response]);
            throw new \Exception('Failed to parse Gemini response.');
        }
    }
}
