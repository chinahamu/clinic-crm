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
            'menus' => Menu::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Menus/Create', [
            'products' => Product::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'duration_minutes' => 'required|integer',
            'required_room_type' => 'nullable|string',
            'required_machine_type' => 'nullable|string',
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
        ]);
    }

    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer',
            'duration_minutes' => 'required|integer',
            'required_room_type' => 'nullable|string',
            'required_machine_type' => 'nullable|string',
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
