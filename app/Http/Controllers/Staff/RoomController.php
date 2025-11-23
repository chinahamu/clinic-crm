<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Staff/Rooms/Index', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Rooms/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        Room::create($validated);

        return redirect()->route('staff.rooms.index')
            ->with('success', 'Room created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        return Inertia::render('Staff/Rooms/Edit', [
            'room' => $room,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'capacity' => 'required|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $room->update($validated);

        return redirect()->route('staff.rooms.index')
            ->with('success', 'Room updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('staff.rooms.index')
            ->with('success', 'Room deleted successfully.');
    }
}
