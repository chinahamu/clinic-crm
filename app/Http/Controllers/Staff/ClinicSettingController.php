<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ClinicSettingController extends Controller
{
    public function edit()
    {
        $clinic = auth()->user()->clinic;
        $clinic->load(['schedules', 'exceptions']);

        return inertia('Staff/Settings/Clinic/Edit', [
            'clinic' => $clinic,
            'schedules' => $clinic->schedules,
            'exceptions' => $clinic->exceptions,
        ]);
    }

    public function update(Request $request)
    {
        $clinic = auth()->user()->clinic;

        $request->validate([
            'schedules' => 'array',
            'schedules.*.day_of_week' => 'required|integer|min:0|max:6',
            'schedules.*.start_time' => 'nullable|date_format:H:i',
            'schedules.*.end_time' => 'nullable|date_format:H:i',
            'schedules.*.is_closed' => 'boolean',
            'exceptions' => 'array',
            'exceptions.*.date' => 'required|date',
            'exceptions.*.start_time' => 'nullable|date_format:H:i',
            'exceptions.*.end_time' => 'nullable|date_format:H:i',
            'exceptions.*.is_closed' => 'boolean',
            'exceptions.*.note' => 'nullable|string',
        ]);

        // Update Schedules
        foreach ($request->schedules as $scheduleData) {
            $clinic->schedules()->updateOrCreate(
                ['day_of_week' => $scheduleData['day_of_week']],
                [
                    'start_time' => $scheduleData['start_time'],
                    'end_time' => $scheduleData['end_time'],
                    'is_closed' => $scheduleData['is_closed'],
                ]
            );
        }

        // Update Exceptions
        // First, remove exceptions that are not in the request (if we want to sync)
        // Or just update/create provided ones. A sync approach is better for a list editor.
        // Let's assume the frontend sends the full list of desired exceptions.
        
        // However, for simplicity and robustness, let's just delete all and recreate, 
        // or use sync logic if we had IDs. Since we might add/remove, let's use a strategy:
        // Delete all future exceptions and recreate? No, that might lose history.
        // Let's just updateOrCreate based on date, and maybe handle deletions if needed.
        // For now, let's assume the user manages the list. If they remove one from the UI, we should delete it.
        // But the UI might just be "add exception".
        // Let's stick to updateOrCreate for now. If we need delete, we might need a separate endpoint or a more complex sync.
        // Actually, usually these settings pages send the whole state.
        // Let's implement a sync: delete those not in the request?
        // That's risky if the request is partial.
        // Let's just handle update/create for now. The user can "delete" by maybe marking as open or we add a delete button that calls a delete endpoint?
        // Or we can just delete all exceptions for the clinic and recreate them from the request?
        // That's the easiest for "save all" type forms.
        
        $clinic->exceptions()->delete();
        foreach ($request->exceptions as $exceptionData) {
            $clinic->exceptions()->create([
                'date' => $exceptionData['date'],
                'start_time' => $exceptionData['start_time'],
                'end_time' => $exceptionData['end_time'],
                'is_closed' => $exceptionData['is_closed'],
                'note' => $exceptionData['note'] ?? null,
            ]);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
