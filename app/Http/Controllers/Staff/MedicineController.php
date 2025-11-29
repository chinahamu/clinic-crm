<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicineController extends Controller
{
    public function index()
    {
        $medicines = Medicine::query()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Staff/Medicines/Index', [
            'medicines' => $medicines,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Medicines/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
            'alert_threshold' => 'required|integer|min:0',
        ]);

        Medicine::create([
            'name' => $request->name,
            'description' => $request->description,
            'unit' => $request->unit,
            'alert_threshold' => $request->alert_threshold,
            'clinic_id' => $request->user()->clinic_id,
        ]);

        return redirect()->route('staff.medicines.index')->with('success', 'Medicine created successfully.');
    }

    public function edit(Medicine $medicine)
    {
        return Inertia::render('Staff/Medicines/Edit', [
            'medicine' => $medicine,
        ]);
    }

    public function update(Request $request, Medicine $medicine)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
            'alert_threshold' => 'required|integer|min:0',
        ]);

        $medicine->update($request->all());

        return redirect()->route('staff.medicines.index')->with('success', 'Medicine updated successfully.');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return redirect()->route('staff.medicines.index')
            ->with('success', '薬剤を削除しました。');
    }
}
