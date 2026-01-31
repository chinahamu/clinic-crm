<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reservation;
use Carbon\Carbon;

class KioskController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Kiosk/CheckIn');
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
        ]);

        $userId = $request->input('user_id');
        $today = Carbon::today();

        // Retrieve the user to ensure it exists (optional, but good for message)
        $user = \App\Models\User::find($userId);
        if (!$user) {
             return response()->json([
                'success' => false,
                'message' => '会員情報が見つかりませんでした。',
            ], 404);
        }

        // Find reservation for today
        // We exclude cancelled reservations if 'status' column supports it.
        // Assuming standard status logic.
        $reservation = Reservation::where('user_id', $userId)
            ->whereDate('start_time', $today)
            ->where('status', '!=', 'cancelled')
            ->orderBy('start_time', 'asc')
            ->first();

        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => '本日の予約が見つかりませんでした。受付までお問い合わせください。',
            ], 404);
        }

        if ($reservation->reception_status === 'checked_in') {
             return response()->json([
                'success' => true,
                'message' => '既に受付済みです。',
                'user_name' => $user->name,
            ]);
        }

        // Update status
        $reservation->update(['reception_status' => 'checked_in']);

        // Set visited_at if column exists (Check logic skipped, usually handled by fillable)
        // If the column exists in DB but not fillable, forceFill could be used, but for MVP we stick to reception_status.

        return response()->json([
            'success' => true,
            'message' => '受付いたしました。お待ちください。',
            'user_name' => $user->name,
        ]);
    }
}
