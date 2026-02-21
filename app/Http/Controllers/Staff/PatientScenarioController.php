<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Jobs\ScheduleScenarioJob;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PatientScenarioController extends Controller
{
    /**
     * スタッフが手動で指定患者にシナリオをトリガーする。
     *
     * POST /staff/patients/{patient}/trigger-scenario
     *
     * @param  Request  $request  trigger_type: no_visit_60d | after_first_visit | after_visit | birthday
     * @param  User     $patient  対象患者
     */
    public function trigger(Request $request, User $patient): RedirectResponse
    {
        $request->validate([
            'trigger_type' => [
                'required',
                'string',
                'in:no_visit_60d,after_first_visit,after_visit,birthday',
            ],
        ]);

        ScheduleScenarioJob::dispatch($patient->id, $request->trigger_type)
            ->onQueue('default');

        return back()->with('success', "{$patient->name} さんへのシナリオをキューに追加しました。");
    }
}
