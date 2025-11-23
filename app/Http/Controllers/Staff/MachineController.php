<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MachineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $machines = Machine::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Staff/Machines/Index', [
            'machines' => $machines,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Staff/Machines/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        Machine::create($validated);

        return redirect()->route('staff.machines.index')
            ->with('success', 'Machine created successfully.');
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
    public function edit(Machine $machine)
    {
        return Inertia::render('Staff/Machines/Edit', [
            'machine' => $machine,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Machine $machine)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $machine->update($validated);

        return redirect()->route('staff.machines.index')
            ->with('success', 'Machine updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Machine $machine)
    {
        $machine->delete();

        return redirect()->route('staff.machines.index')
            ->with('success', 'Machine deleted successfully.');
    }
}
