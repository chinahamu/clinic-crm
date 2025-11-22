<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\Room;
use App\Models\Machine;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function create()
    {
        return Inertia::render('Reservations/Create', [
            'menus' => Menu::where('is_active', true)->get(),
        ]);
    }

    public function availability(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'date' => 'required|date',
        ]);

        $menu = Menu::find($request->menu_id);
        $date = Carbon::parse($request->date);
        $duration = $menu->duration_minutes;

        // Define clinic hours (could be dynamic)
        $startOfDay = $date->copy()->setHour(9)->setMinute(0);
        $endOfDay = $date->copy()->setHour(18)->setMinute(0);

        $slots = [];
        $current = $startOfDay->copy();

        while ($current->copy()->addMinutes($duration)->lte($endOfDay)) {
            $start = $current->copy();
            $end = $current->copy()->addMinutes($duration);

            if ($this->isSlotAvailable($start, $end, $menu)) {
                $slots[] = $start->format('H:i');
            }

            $current->addMinutes(30); // 30 min intervals
        }

        return response()->json(['slots' => $slots]);
    }

    private function isSlotAvailable($start, $end, $menu)
    {
        // Check Staff Availability
        // Must have a shift covering this time
        $staffWithShift = Shift::where('start_time', '<=', $start)
            ->where('end_time', '>=', $end)
            ->pluck('staff_id');

        if ($staffWithShift->isEmpty()) {
            return false;
        }

        // Check if any of these staff are free
        // Overlap: (StartA < EndB) and (EndA > StartB)
        $busyStaff = Reservation::whereIn('staff_id', $staffWithShift)
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->pluck('staff_id');
        
        $availableStaff = $staffWithShift->diff($busyStaff);

        if ($availableStaff->isEmpty()) {
            return false;
        }

        // Check Room Availability
        // Use required_room_type from menu if set, otherwise any room (or specific default)
        $roomType = $menu->required_room_type;
        
        $totalRoomsQuery = Room::query();
        if ($roomType) {
            $totalRoomsQuery->where('type', $roomType);
        }
        $totalRooms = $totalRoomsQuery->count();

        $busyRooms = Reservation::whereNotNull('room_id')
            ->whereHas('room', function($q) use ($roomType) {
                if ($roomType) {
                    $q->where('type', $roomType);
                }
            })
            ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })->count();

        if ($busyRooms >= $totalRooms) {
            return false;
        }

        // Check Machine Availability
        $machineType = $menu->required_machine_type;
        if ($machineType) {
             $totalMachines = Machine::where('type', $machineType)->count();
             $busyMachines = Reservation::whereNotNull('machine_id')
             ->whereHas('machine', function($q) use ($machineType) {
                 $q->where('type', $machineType);
             })
             ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })->count();

            if ($busyMachines >= $totalMachines) {
                return false;
            }
        }

        return true;
    }

    public function store(Request $request)
    {
        $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'start_time' => 'required|date',
        ]);

        $menu = Menu::find($request->menu_id);
        $start = Carbon::parse($request->start_time);
        $end = $start->copy()->addMinutes($menu->duration_minutes);

        // Assign resources (Simplified: Pick first available)
        
        // Find available staff
        $staffId = $this->findAvailableStaff($start, $end);
        $roomId = $this->findAvailableRoom($start, $end, $menu->required_room_type);
        
        $machineId = null;
        if ($menu->required_machine_type) {
            $machineId = $this->findAvailableMachine($start, $end, $menu->required_machine_type);
            if (!$machineId) {
                 return back()->withErrors(['message' => 'Selected slot is no longer available (Machine).']);
            }
        }

        if (!$staffId || !$roomId) {
             return back()->withErrors(['message' => 'Selected slot is no longer available.']);
        }

        Reservation::create([
            'user_id' => auth()->id(),
            'menu_id' => $menu->id,
            'staff_id' => $staffId,
            'room_id' => $roomId,
            'machine_id' => $machineId,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'confirmed',
        ]);

        return redirect()->route('home')->with('success', 'Reservation created!');
    }

    private function findAvailableStaff($start, $end) {
         $staffWithShift = Shift::where('start_time', '<=', $start)
            ->where('end_time', '>=', $end)
            ->pluck('staff_id');
        
        $busyStaff = Reservation::whereIn('staff_id', $staffWithShift)
             ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->pluck('staff_id');

        return $staffWithShift->diff($busyStaff)->first();
    }

    private function findAvailableRoom($start, $end, $type = null) {
        $roomQuery = Room::query();
        if ($type) {
            $roomQuery->where('type', $type);
        }
        $allRooms = $roomQuery->pluck('id');

        $busyRooms = Reservation::whereNotNull('room_id')
             ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->pluck('room_id');
        
        return $allRooms->diff($busyRooms)->first();
    }

    private function findAvailableMachine($start, $end, $type) {
        $allMachines = Machine::where('type', $type)->pluck('id');
        $busyMachines = Reservation::whereNotNull('machine_id')
             ->whereHas('machine', function($q) use ($type) {
                 $q->where('type', $type);
             })
             ->where(function ($query) use ($start, $end) {
                $query->where('start_time', '<', $end)
                      ->where('end_time', '>', $start);
            })
            ->pluck('machine_id');
        
        return $allMachines->diff($busyMachines)->first();
    }
}
