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
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationCompleted;
use App\Mail\NewReservationNotification;

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
        $requiredRole = $menu->required_role;

        $staffQuery = Shift::where('clinic_id', $clinicId)
            ->where('start_time', '<=', $start)
            ->where('end_time', '>=', $end);

        if ($requiredRole) {
            $staffQuery->whereHas('staff', function ($q) use ($requiredRole) {
                $q->role($requiredRole);
            });
        }

        $staffWithShift = $staffQuery->pluck('staff_id');

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
        $machineId = $menu->required_machine_id;
        if ($machineId) {
             $machine = Machine::find($machineId);
             if (!$machine) {
                 return false;
             }
             $totalMachines = $machine->quantity;
             
             $busyMachines = Reservation::where('clinic_id', $clinicId)
             ->where('machine_id', $machineId)
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

    public function store(Request $request)
    {
        $request->validate([
            'clinic_code' => 'required|exists:clinics,code',
            'menu_id' => 'required|exists:menus,id',
            'start_date' => 'required|date',
            'start_time' => 'required',
        ]);

        $clinic = Clinic::where('code', $request->clinic_code)->firstOrFail();
        $menu = Menu::findOrFail($request->menu_id);
        
        // Ensure user is authenticated
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = auth()->user();
        $startDateTime = Carbon::parse($request->start_date . ' ' . $request->start_time);
        $endDateTime = $startDateTime->copy()->addMinutes($menu->duration_minutes);

        // Basic availability check again (race condition check)
        if (!$this->isSlotAvailable($startDateTime, $endDateTime, $menu, $clinic->id)) {
             return response()->json(['message' => 'Selected slot is no longer available.'], 422);
        }

        // Assign resources
        
        // Find a free staff
        $requiredRole = $menu->required_role;
        $staffQuery = Shift::where('clinic_id', $clinic->id)
            ->where('start_time', '<=', $startDateTime)
            ->where('end_time', '>=', $endDateTime);
            
        if ($requiredRole) {
            $staffQuery->whereHas('staff', function ($q) use ($requiredRole) {
                $q->role($requiredRole);
            });
        }
        
        $potentialStaff = $staffQuery->pluck('staff_id');
        
        // Filter out busy staff
        $busyStaff = Reservation::whereIn('staff_id', $potentialStaff)
             ->where(function ($query) use ($startDateTime, $endDateTime) {
                $query->where('start_time', '<', $endDateTime)
                      ->where('end_time', '>', $startDateTime);
            })
            ->where('status', '!=', 'cancelled')
            ->pluck('staff_id');
            
        $staffId = $potentialStaff->diff($busyStaff)->first();

        if (!$staffId) {
             return response()->json(['message' => 'No staff available.'], 422);
        }

        // Find Room
        $roomId = null;
        $roomType = $menu->required_room_type;
        if ($roomType) {
             $potentialRooms = Room::where('clinic_id', $clinic->id)->where('type', $roomType)->pluck('id');
             $busyRooms = Reservation::whereIn('room_id', $potentialRooms)
                ->where(function ($query) use ($startDateTime, $endDateTime) {
                    $query->where('start_time', '<', $endDateTime)
                        ->where('end_time', '>', $startDateTime);
                })
                ->where('status', '!=', 'cancelled')
                ->pluck('room_id');
            $roomId = $potentialRooms->diff($busyRooms)->first();
            
            if (!$roomId) {
                 return response()->json(['message' => 'No room available.'], 422);
            }
        }

        // Find Machine
        $machineId = null;
        if ($menu->required_machine_id) {
            $machineId = $menu->required_machine_id;
            // Availability already checked in isSlotAvailable
        }

        $reservation = Reservation::create([
            'clinic_id' => $clinic->id,
            'user_id' => $user->id,
            'menu_id' => $menu->id,
            'staff_id' => $staffId,
            'room_id' => $roomId,
            'machine_id' => $machineId,
            'start_time' => $startDateTime,
            'end_time' => $endDateTime,
            'status' => 'confirmed', // or pending
        ]);

        // Check for active contract and consume ticket
        $contract = \App\Models\Contract::where('user_id', $user->id)
            ->where('menu_id', $menu->id)
            ->where('status', 'active')
            ->where('remaining_count', '>', 0)
            ->where(function($q) {
                $q->whereNull('expiration_date')
                  ->orWhere('expiration_date', '>=', now());
            })
            ->orderBy('expiration_date', 'asc') // Use earliest expiring first
            ->first();

        if ($contract) {
            $contract->consume($reservation->id);
        }

        // Send notifications
        $lineService = app(\App\Services\LineMessagingService::class);
        $notificationSent = false;

        if ($user->line_id) {
            // Send to LINE
            $notificationSent = $lineService->sendReservationConfirmation($user->line_id, $reservation);
        } 
        
        // If LINE is not linked, or LINE sending failed (optional fallback logic, but here strict 'else' requested)
        // The request says "If LINE linked, send to LINE. Otherwise send to email."
        // We will strictly follow "If LINE linked -> LINE", "Else -> Email".
        
        if (!$user->line_id) {
            Mail::to($user->email)->send(new ReservationCompleted($reservation));
        }

        // Always notify admin
        // TODO: Replace with actual clinic admin email
        Mail::to('kento.takamatsu@meta-alchemist.co.jp')->send(new NewReservationNotification($reservation));

        return response()->json(['reservation' => $reservation]);
    }
}
