<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\MedicalInterviewTemplate;
use App\Models\MedicalInterviewResponse;
use App\Services\NarrativeSyncService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterviewController extends Controller
{
    protected $narrativeSyncService;

    public function __construct(NarrativeSyncService $narrativeSyncService)
    {
        $this->narrativeSyncService = $narrativeSyncService;
    }

    public function show(Reservation $reservation)
    {
        // For this implementation, we grab the first available template.
        // In a real app, this might depend on the menu/course associated with the reservation.
        $template = MedicalInterviewTemplate::firstOrFail();

        return Inertia::render('Patient/Interview/Show', [
            'reservation' => $reservation,
            'template' => $template,
        ]);
    }

    public function store(Request $request, Reservation $reservation)
    {
        $request->validate([
            'template_id' => 'required|exists:medical_interview_templates,id',
            'answers' => 'required|array',
        ]);

        $template = MedicalInterviewTemplate::findOrFail($request->template_id);
        $answers = $request->answers;

        // 1. Save RAW response
        MedicalInterviewResponse::create([
            'reservation_id' => $reservation->id,
            'template_id' => $template->id,
            'answers' => $answers,
        ]);

        // 2. Sync to Narrative Profile
        // Ensure we consider the patient associated with the reservation
        $patient = $reservation->user;
        if ($patient) {
            $this->narrativeSyncService->syncFromInterview($patient, $answers, $template->questions ?? []);
        }

        // 3. Redirect
        // Redirect to reservation detail or dashboard
        return redirect()->route('patient.reservations.show', $reservation->id)
            ->with('success', '問診の回答を送信しました。当日お待ちしております。');
    }
}
