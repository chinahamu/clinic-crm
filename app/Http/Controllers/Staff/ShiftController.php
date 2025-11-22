<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        // デフォルトで今週のシフトを表示
        $start = $request->input('start') ? Carbon::parse($request->input('start')) : Carbon::now()->startOfWeek();
        $end = $request->input('end') ? Carbon::parse($request->input('end')) : Carbon::now()->endOfWeek();

        $shifts = Shift::with('staff')
            ->whereBetween('start_time', [$start, $end])
            ->get()
            ->map(function ($shift) {
                return [
                    'id' => $shift->id,
                    'staff_id' => $shift->staff_id,
                    'staff_name' => $shift->staff->name,
                    'start' => $shift->start_time->toIso8601String(),
                    'end' => $shift->end_time->toIso8601String(),
                    'title' => $shift->staff->name, // For calendar
                ];
            });

        return Inertia::render('Staff/Shifts/Index', [
            'shifts' => $shifts,
            'staffList' => Staff::all(),
            'currentStart' => $start->toDateString(),
            'currentEnd' => $end->toDateString(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $date = $request->date;
        $start = Carbon::parse("$date {$request->start_time}");
        $end = Carbon::parse("$date {$request->end_time}");

        Shift::create([
            'staff_id' => $request->staff_id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'scheduled',
        ]);

        return redirect()->back()->with('success', 'Shift added.');
    }

    public function destroy(Shift $shift)
    {
        $shift->delete();
        return redirect()->back()->with('success', 'Shift deleted.');
    }
}
