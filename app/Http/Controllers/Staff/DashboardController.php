<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $todayReservationsCount = Reservation::whereDate('start_time', $today)->count();

        $todaySchedule = Reservation::with(['user', 'menu'])
            ->whereDate('start_time', $today)
            ->orderBy('start_time')
            ->get();

        $lowStockMedicines = \App\Models\Medicine::whereHas('stock', function ($query) {
            $query->whereRaw('stocks.quantity <= medicines.alert_threshold');
        })->with('stock')->get();

        $lowStockConsumables = \App\Models\Consumable::whereHas('stock', function ($query) {
            $query->whereRaw('stocks.quantity <= consumables.alert_threshold');
        })->with('stock')->get();

        return Inertia::render('Staff/Dashboard', [
            'today_reservations_count' => $todayReservationsCount,
            'today_schedule' => $todaySchedule,
            'low_stock_products' => \App\Models\Product::whereColumn('stock', '<=', 'threshold')->get(),
            'low_stock_medicines' => $lowStockMedicines,
            'low_stock_consumables' => $lowStockConsumables,
        ]);
    }
}
