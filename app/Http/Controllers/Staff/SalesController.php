<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function index()
    {
        $salesData = Reservation::where('reception_status', 'completed')
            ->join('menus', 'reservations.menu_id', '=', 'menus.id')
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
        ]);
    }
}
