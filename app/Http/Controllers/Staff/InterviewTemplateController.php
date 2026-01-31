<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\MedicalInterviewTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InterviewTemplateController extends Controller
{
    public function index()
    {
        $templates = MedicalInterviewTemplate::all();
        return Inertia::render('Staff/Settings/Interviews/Index', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Settings/Interviews/Edit', [
             'template' => new MedicalInterviewTemplate(['questions' => []]),
        ]);
    }

    public function store(Request $request)
    {
         $request->validate([
            'name' => 'required|string|max:255',
            'questions' => 'nullable|array',
        ]);

        $template = MedicalInterviewTemplate::create($request->all());

        return redirect()->route('staff.settings.interviews.edit', $template->id)
            ->with('success', 'テンプレートを作成しました');
    }

    public function edit(MedicalInterviewTemplate $interview)
    {
        // Route resource parameter name is 'interview' by default for 'interviews' resource?
        // Wait, default param name is singular of resource name. 'interviews' -> 'interview'.
        return Inertia::render('Staff/Settings/Interviews/Edit', [
            'template' => $interview,
        ]);
    }

    public function update(Request $request, MedicalInterviewTemplate $interview)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'questions' => 'nullable|array',
        ]);

        $interview->update($request->all());

        return redirect()->back()->with('success', 'テンプレートを更新しました');
    }

    public function destroy(MedicalInterviewTemplate $interview)
    {
        $interview->delete();
        return redirect()->route('staff.settings.interviews.index')->with('success', '削除しました');
    }
}
