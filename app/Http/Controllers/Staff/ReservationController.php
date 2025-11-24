<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
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

        $query = Reservation::with(['user', 'menu', 'staff', 'room', 'machine'])
            ->whereBetween('start_time', [$start, $end]);

        if ($request->filled('patient_id')) {
            $query->where('user_id', $request->input('patient_id'));
        }

        $reservations = $query->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'title' => $reservation->user->name . ' (' . $reservation->menu->name . ')',
                    'start' => $reservation->start_time->toIso8601String(),
                    'end' => $reservation->end_time->toIso8601String(),
                    'user_name' => $reservation->user->name,
                    'menu_name' => $reservation->menu->name,
                    'staff_name' => $reservation->staff ? $reservation->staff->name : '未定',
                    'room_name' => $reservation->room ? $reservation->room->name : '未定',
                    'machine_name' => $reservation->machine ? $reservation->machine->name : 'なし',
                    'status' => $reservation->status,
                    'reception_status' => $reservation->reception_status,
                ];
            });

        // 患者リスト（全ユーザーまたは患者ロールを持つユーザー）
        // ここでは全ユーザーを取得していますが、必要に応じてロールで絞り込んでください
        $patientList = \App\Models\User::all();

        return Inertia::render('Staff/Reservations/Index', [
            'reservations' => $reservations,
            'patientList' => $patientList,
            'currentStart' => $start->toDateString(),
            'currentEnd' => $end->toDateString(),
            'filters' => $request->only(['patient_id']),
        ]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $request->validate([
            'reception_status' => 'required|string',
        ]);

        $reservation->update([
            'reception_status' => $request->reception_status,
        ]);

        return redirect()->back()->with('success', 'Status updated.');
    }
}
