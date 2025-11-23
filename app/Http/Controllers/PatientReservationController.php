<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientReservationController extends Controller
{
    public function index($code)
    {
        $clinic = Clinic::where('code', $code)->firstOrFail();
        
        // Menus are currently global
        $menus = Menu::where('is_active', true)->get();

        return Inertia::render('Patient/Reservation/Index', [
            'clinic' => $clinic,
            'menus' => $menus,
        ]);
    }
}
