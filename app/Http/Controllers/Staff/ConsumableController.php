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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'unit' => 'required|string|max:50',
        ]);

        Consumable::create($validated);

        return redirect()->route('staff.consumables.index')
            ->with('success', '消耗品を登録しました。');
    }

    public function edit(Consumable $consumable)
    {
        return Inertia::render('Staff/Consumables/Edit', [
            'consumable' => $consumable,
        ]);
    }

    public function update(Request $request, Consumable $consumable)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'unit' => 'required|string|max:50',
        ]);

        $consumable->update($validated);

        return redirect()->route('staff.consumables.index')
            ->with('success', '消耗品情報を更新しました。');
    }

    public function destroy(Consumable $consumable)
    {
        $consumable->delete();

        return redirect()->route('staff.consumables.index')
            ->with('success', '消耗品を削除しました。');
    }
}
