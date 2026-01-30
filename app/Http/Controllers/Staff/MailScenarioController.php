<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\MailScenario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailScenarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clinicId = auth('staff')->user()->clinic_id;

        $scenarios = MailScenario::where('clinic_id', $clinicId)
            ->latest()
            ->get();

        return Inertia::render('Staff/Settings/MailScenarios/Index', [
            'scenarios' => $scenarios,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Settings/MailScenarios/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'trigger_type' => 'required|string',
            'days_offset' => 'required|integer|min:0',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $clinicId = auth('staff')->user()->clinic_id;

        MailScenario::create([
            'clinic_id' => $clinicId,
            ...$request->all(),
        ]);

        return redirect()->route('staff.mail-scenarios.index')
            ->with('success', 'シナリオを作成しました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $clinicId = auth('staff')->user()->clinic_id;
        $scenario = MailScenario::where('clinic_id', $clinicId)->findOrFail($id);

        return Inertia::render('Staff/Settings/MailScenarios/Edit', [
            'scenario' => $scenario,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $clinicId = auth('staff')->user()->clinic_id;
        $scenario = MailScenario::where('clinic_id', $clinicId)->findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'boolean',
            'trigger_type' => 'required|string',
            'days_offset' => 'required|integer|min:0',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $scenario->update($request->all());

        return redirect()->route('staff.mail-scenarios.index')
            ->with('success', 'シナリオを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $clinicId = auth('staff')->user()->clinic_id;
        $scenario = MailScenario::where('clinic_id', $clinicId)->findOrFail($id);

        $scenario->delete();

        return redirect()->back()
            ->with('success', 'シナリオを削除しました。');
    }
}
