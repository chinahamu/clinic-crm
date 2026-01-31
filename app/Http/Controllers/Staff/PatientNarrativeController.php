<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\LifeEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientNarrativeController extends Controller
{
    public function updateValues(Request $request, User $patient)
    {
        $validated = $request->validate([
            'values' => 'required|array',
            'values.*.attribute_name' => 'required|string',
            'values.*.score' => 'required|integer|min:1|max:5',
            'values.*.notes' => 'nullable|string',
        ]);

        // Assuming single clinic context for now as per app structure usually implies logged in staff's clinic
        // However, prompt asked for clinic_id in table.
        // We will use the staff's clinic_id if available, or a default.
        // Checking Staff model, it has clinic_id.
        $clinicId = auth()->guard('staff')->user()->clinic_id ?? 1; // Fallback or strict? Better to use auth user's clinic.

        DB::transaction(function () use ($patient, $validated, $clinicId) {
            foreach ($validated['values'] as $value) {
                $patient->patientValues()->updateOrCreate(
                    [
                        'clinic_id' => $clinicId,
                        'attribute_name' => $value['attribute_name'],
                    ],
                    [
                        'score' => $value['score'],
                        'notes' => $value['notes'] ?? null,
                    ]
                );
            }
        });

        return back()->with('success', '価値観スコアを更新しました。');
    }

    public function storeLifeEvent(Request $request, User $patient)
    {
        $validated = $request->validate([
            'occurred_at' => 'required|date',
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'impact_level' => 'required|integer|min:1|max:3',
        ]);

        $patient->lifeEvents()->create($validated);

        return back()->with('success', 'ライフイベントを追加しました。');
    }

    public function destroyLifeEvent(User $patient, LifeEvent $event)
    {
        if ($event->user_id !== $patient->id) {
            abort(403);
        }

        $event->delete();

        return back()->with('success', 'ライフイベントを削除しました。');
    }

    public function storeNarrative(Request $request, User $patient)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'emotional_tags' => 'nullable|array',
            'context' => 'nullable|string',
        ]);

        $patient->narrativeLogs()->create([
            'staff_id' => auth()->guard('staff')->id(),
            'content' => $validated['content'],
            'emotional_tags' => $validated['emotional_tags'] ?? null,
            'context' => $validated['context'] ?? null,
        ]);

        return back()->with('success', 'ナラティブログを記録しました。');
    }
}
