<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Consumable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsumableController extends Controller
{
    public function index()
    {
        $consumables = Consumable::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Staff/Consumables/Index', [
            'consumables' => $consumables,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Consumables/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:50',
            'unit' => 'required|string|max:50',
            'alert_threshold' => 'required|integer|min:0',
        ]);

        Consumable::create([
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->category,
            'unit' => $request->unit,
            'alert_threshold' => $request->alert_threshold,
            'clinic_id' => $request->user()->clinic_id,
        ]);

        return redirect()->route('staff.consumables.index')->with('success', 'Consumable created successfully.');
    }

    public function edit(Consumable $consumable)
    {
        return Inertia::render('Staff/Consumables/Edit', [
            'consumable' => $consumable,
        ]);
    }

    public function update(Request $request, Consumable $consumable)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:50',
            'unit' => 'required|string|max:50',
            'alert_threshold' => 'required|integer|min:0',
        ]);

        $consumable->update($request->all());

        return redirect()->route('staff.consumables.index')->with('success', 'Consumable updated successfully.');
    }

    public function destroy(Consumable $consumable)
    {
        $consumable->delete();

        return redirect()->route('staff.consumables.index')
            ->with('success', '消耗品を削除しました。');
    }
}
