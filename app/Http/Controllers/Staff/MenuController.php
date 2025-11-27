<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Menus/Index', [
            'menus' => Menu::with('requiredMachine')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Menus/Create', [
            'products' => Product::where('is_active', true)->get(),
            'roomTypes' => \App\Models\Room::select('type')->distinct()->whereNotNull('type')->pluck('type'),
            'machines' => \App\Models\Machine::where('is_active', true)->get(),
            'roles' => \Spatie\Permission\Models\Role::where('guard_name', 'staff')->pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'duration_minutes' => 'required|integer',
            'required_role' => 'nullable|string|exists:roles,name',
            'required_room_type' => 'nullable|string',
            'required_machine_id' => 'nullable|exists:machines,id',
            'num_tickets' => 'nullable|integer|min:1',
            'validity_period_days' => 'nullable|integer|min:1',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $menu = Menu::create($request->except('product_ids'));

        if ($request->has('product_ids')) {
            $menu->products()->sync($request->product_ids);
        }

        return redirect()->route('staff.menus.index')->with('success', 'Menu created successfully.');
    }

    public function edit(Menu $menu)
    {
        $menu->load('products');
        return Inertia::render('Staff/Menus/Edit', [
            'menu' => $menu,
            'products' => Product::where('is_active', true)->get(),
            'roomTypes' => \App\Models\Room::select('type')->distinct()->whereNotNull('type')->pluck('type'),
            'machines' => \App\Models\Machine::where('is_active', true)->get(),
            'roles' => \Spatie\Permission\Models\Role::where('guard_name', 'staff')->pluck('name'),
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'duration_minutes' => 'required|integer',
            'required_role' => 'nullable|string|exists:roles,name',
            'required_room_type' => 'nullable|string',
            'required_machine_id' => 'nullable|exists:machines,id',
            'num_tickets' => 'nullable|integer|min:1',
            'validity_period_days' => 'nullable|integer|min:1',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
        ]);

        $menu->update($request->except('product_ids'));

        if ($request->has('product_ids')) {
            $menu->products()->sync($request->product_ids);
        }

        return redirect()->route('staff.menus.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->route('staff.menus.index')->with('success', 'Menu deleted successfully.');
    }
}
