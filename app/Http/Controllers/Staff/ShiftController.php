<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\ShiftRequest;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

use App\Services\ShiftGenerationService;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        // デフォルトで今週のシフトを表示
        // デフォルトを「本日から1週間（本日 + 6日）」に変更
        if ($request->input('start')) {
            $start = Carbon::parse($request->input('start'));
        } else {
            $start = Carbon::today();
        }

        if ($request->input('end')) {
            $end = Carbon::parse($request->input('end'));
        } elseif ($request->input('start')) {
            // start が指定されているが end が無ければ start から1週間表示
            $end = Carbon::parse($request->input('start'))->addDays(6);
        } else {
            $end = Carbon::today()->addDays(6);
        }

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
                    'status' => $shift->status,
                ];
            });

        $shiftRequests = ShiftRequest::with('staff')
            ->whereBetween('date', [$start, $end])
            ->get();

        return Inertia::render('Staff/Shifts/Index', [
            'shifts' => $shifts,
            'shiftRequests' => $shiftRequests,
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

    public function storeRequests(Request $request)
    {
        $request->validate([
            'staff_id' => 'required|exists:staff,id',
            'requests' => 'required|array',
            'requests.*.date' => 'required|date',
            'requests.*.start_time' => 'nullable|date_format:H:i',
            'requests.*.end_time' => 'nullable|date_format:H:i|after:requests.*.start_time',
            'requests.*.is_holiday' => 'boolean',
            'requests.*.note' => 'nullable|string',
        ]);

        foreach ($request->requests as $req) {
            ShiftRequest::updateOrCreate(
                [
                    'staff_id' => $request->staff_id,
                    'date' => $req['date'],
                ],
                [
                    'start_time' => $req['start_time'] ?? null,
                    'end_time' => $req['end_time'] ?? null,
                    'is_holiday' => $req['is_holiday'] ?? false,
                    'note' => $req['note'] ?? null,
                ]
            );
        }

        return redirect()->back()->with('success', 'Shift requests submitted.');
    }

    public function generate(Request $request, ShiftGenerationService $service)
    {
        $request->validate([
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);

        $start = Carbon::parse($request->start);
        $end = Carbon::parse($request->end);

        try {
            $generatedShifts = $service->generate($start, $end);

            foreach ($generatedShifts as $shiftData) {
                Shift::create([
                    'staff_id' => $shiftData['staff_id'],
                    'start_time' => Carbon::parse($shiftData['date'] . ' ' . $shiftData['start_time']),
                    'end_time' => Carbon::parse($shiftData['date'] . ' ' . $shiftData['end_time']),
                    'status' => 'draft',
                ]);
            }

            return redirect()->back()->with('success', 'Shifts generated successfully (Draft).');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to generate shifts: ' . $e->getMessage());
        }
    }
}
