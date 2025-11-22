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
        $start = $request->input('start') ? Carbon::parse($request->input('start')) : Carbon::now()->startOfWeek();
        $end = $request->input('end') ? Carbon::parse($request->input('end')) : Carbon::now()->endOfWeek();

        $reservations = Reservation::with(['user', 'menu', 'staff', 'room', 'machine'])
            ->whereBetween('start_time', [$start, $end])
            ->get()
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

        return Inertia::render('Staff/Reservations/Index', [
            'reservations' => $reservations,
            'currentStart' => $start->toDateString(),
            'currentEnd' => $end->toDateString(),
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
