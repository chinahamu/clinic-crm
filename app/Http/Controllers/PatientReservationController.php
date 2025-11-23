<?php

namespace App\Http\Controllers;

use App\Models\Clinic;
use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\Room;
use App\Models\Machine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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

    public function availability(Request $request, $code)
    {
        $clinic = Clinic::where('code', $code)->firstOrFail();

        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'start_date' => 'required|date',
        ]);

        $menu = Menu::find($request->menu_id);
        $startDate = Carbon::parse($request->start_date);
        $duration = $menu->duration_minutes;

        $dates = [];
        $slots = [];
        $availability = [];

        // Generate 7 days
        for ($i = 0; $i < 7; $i++) {
            $date = $startDate->copy()->addDays($i);
            $dates[] = $date->format('Y-m-d');
            
            // Define clinic hours (09:00 - 18:00)
            $startOfDay = $date->copy()->setHour(9)->setMinute(0);
            $endOfDay = $date->copy()->setHour(18)->setMinute(0);

            $current = $startOfDay->copy();

            while ($current->copy()->addMinutes($duration)->lte($endOfDay)) {
                $timeStr = $current->format('H:i');
                if (!in_array($timeStr, $slots)) {
                    $slots[] = $timeStr;
                }

                $start = $current->copy();
                $end = $current->copy()->addMinutes($duration);

                $isAvailable = $this->isSlotAvailable($start, $end, $menu, $clinic->id);
                
                $availability[$date->format('Y-m-d')][$timeStr] = $isAvailable;

                $current->addMinutes(30);
            }
        }
        
        sort($slots);

        return response()->json([
            'dates' => $dates,
            'slots' => $slots,
            'availability' => $availability,
        ]);
    }

    private function isSlotAvailable($start, $end, $menu, $clinicId)
    {
        // Check Staff Availability
        // Must have a shift covering this time
        $staffWithShift = Shift::where('clinic_id', $clinicId)
            ->where('start_time', '<=', $start)
            ->where('end_time', '>=', $end)
            ->pluck('staff_id');

        if ($staffWithShift->isEmpty()) {
            return false;
        }

        // Check if any of these staff are free
        $busyStaff = Reservation::whereIn('staff_id', $staffWithShift)
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->where('status', '!=', 'cancelled') // Assuming cancelled status exists or we should ignore it
            ->pluck('staff_id');
        
        $availableStaff = $staffWithShift->diff($busyStaff);

        if ($availableStaff->isEmpty()) {
            return false;
        }

        // Check Room Availability
        $roomType = $menu->required_room_type;
        
        $totalRoomsQuery = Room::where('clinic_id', $clinicId);
        if ($roomType) {
            $totalRoomsQuery->where('type', $roomType);
        }
        $totalRooms = $totalRoomsQuery->count();

        if ($totalRooms === 0) {
             // If no rooms defined but required, then unavailable. 
             // If roomType is null, maybe we don't need a room? 
             // But usually a room is needed. Assuming at least one room exists if no type specified.
             // If roomType is null, we count all rooms.
             return false;
        }

        $busyRooms = Reservation::where('clinic_id', $clinicId)
            ->whereNotNull('room_id')
            ->whereHas('room', function($q) use ($roomType) {
                if ($roomType) {
                    $q->where('type', $roomType);
                }
            })
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->where('status', '!=', 'cancelled')
            ->count();

        if ($busyRooms >= $totalRooms) {
            return false;
        }

        // Check Machine Availability
        $machineType = $menu->required_machine_type;
        if ($machineType) {
             $totalMachines = Machine::where('clinic_id', $clinicId)->where('type', $machineType)->count();
             
             if ($totalMachines === 0) {
                 return false;
             }

             $busyMachines = Reservation::where('clinic_id', $clinicId)
             ->whereNotNull('machine_id')
             ->whereHas('machine', function($q) use ($machineType) {
                 $q->where('type', $machineType);
             })
             ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->where('status', '!=', 'cancelled')
            ->count();

            if ($busyMachines >= $totalMachines) {
                return false;
            }
        }

        return true;
    }
}
