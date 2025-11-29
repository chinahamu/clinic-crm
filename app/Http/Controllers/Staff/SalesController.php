<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $query = Reservation::where('reception_status', 'completed')
            ->whereBetween('start_time', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        $salesData = $query->join('menus', 'reservations.menu_id', '=', 'menus.id')
            ->select(
                'menus.id',
                'menus.name',
                DB::raw('count(*) as count'),
                DB::raw('sum(menus.price) as total_sales')
            )
            ->groupBy('menus.id', 'menus.name')
            ->orderByDesc('total_sales')
            ->get();

        $totalSales = $salesData->sum('total_sales');
        $totalCount = $salesData->sum('count');

        return Inertia::render('Staff/Sales/Index', [
            'salesData' => $salesData,
            'totalSales' => $totalSales,
            'totalCount' => $totalCount,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
