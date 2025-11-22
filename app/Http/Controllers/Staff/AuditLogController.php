<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = Activity::latest()->paginate(20);

        return Inertia::render('Staff/AuditLogs/Index', [
            'logs' => $logs,
        ]);
    }
}
