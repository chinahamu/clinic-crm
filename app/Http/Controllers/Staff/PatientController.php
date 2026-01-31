<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $patients = User::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Staff/Patients/Index', [
            'patients' => $patients,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $patient)
    {
        activity()
            ->performedOn($patient)
            ->causedBy(auth()->guard('staff')->user())
            ->log('viewed_patient_chart');

        $patient->load([
            'contracts.menu', 
            'signedDocuments.documentTemplate',
            'patientValues',
            'lifeEvents',
            'narrativeLogs.staff'
        ]);
        $menus = \App\Models\Menu::where('is_active', true)->get();

        return Inertia::render('Staff/Patients/Show', [
            'patient' => $patient,
            'menus' => $menus,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $patient)
    {
        return Inertia::render('Staff/Patients/Edit', [
            'patient' => $patient,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $patient->id,
            'phone' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|string|max:10',
            'address' => 'nullable|string|max:500',
            'referral_source' => 'nullable|string|max:255',
            'consent_status' => 'nullable|string|max:50',
            'caution_flag' => 'boolean',
            'caution_details' => 'nullable|string|max:1000',
        ]);

        $patient->update($validated);

        return redirect()->route('staff.patients.show', $patient)
            ->with('success', '患者情報を更新しました。');
    }
}
