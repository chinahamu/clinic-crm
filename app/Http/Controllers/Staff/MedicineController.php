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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
        ]);

        Medicine::create($validated);

        return redirect()->route('staff.medicines.index')
            ->with('success', '薬剤を登録しました。');
    }

    public function edit(Medicine $medicine)
    {
        return Inertia::render('Staff/Medicines/Edit', [
            'medicine' => $medicine,
        ]);
    }

    public function update(Request $request, Medicine $medicine)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:50',
        ]);

        $medicine->update($validated);

        return redirect()->route('staff.medicines.index')
            ->with('success', '薬剤情報を更新しました。');
    }

    public function destroy(Medicine $medicine)
    {
        $medicine->delete();

        return redirect()->route('staff.medicines.index')
            ->with('success', '薬剤を削除しました。');
    }
}
