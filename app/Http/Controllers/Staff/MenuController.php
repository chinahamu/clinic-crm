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
            'medicines' => \App\Models\Medicine::all(),
            'consumables' => \App\Models\Consumable::all(),
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
            'campaign_flag' => 'boolean',
            'publish_start_at' => 'nullable|date',
            'publish_end_at' => 'nullable|date|after:publish_start_at',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'items' => 'nullable|array',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|in:medicine,consumable',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $menu = Menu::create($request->except(['product_ids', 'items']));

        if ($request->has('product_ids')) {
            $menu->products()->sync($request->product_ids);
        }

        if ($request->has('items')) {
            foreach ($request->items as $item) {
                $modelClass = $item['type'] === 'medicine' ? \App\Models\Medicine::class : \App\Models\Consumable::class;
                $menu->items()->create([
                    'item_id' => $item['id'],
                    'item_type' => $modelClass,
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        return redirect()->route('staff.menus.index')->with('success', 'Menu created successfully.');
    }

    public function edit(Menu $menu)
    {
        $menu->load(['products', 'items.item']);
        
        // Transform items for frontend
        $menuItems = $menu->items->map(function ($menuItem) {
            return [
                'id' => $menuItem->item_id,
                'type' => $menuItem->item_type === \App\Models\Medicine::class ? 'medicine' : 'consumable',
                'quantity' => $menuItem->quantity,
                'name' => $menuItem->item ? $menuItem->item->name : 'Unknown',
                'unit' => $menuItem->item ? $menuItem->item->unit : '',
            ];
        });

        return Inertia::render('Staff/Menus/Edit', [
            'menu' => $menu,
            'menuItems' => $menuItems,
            'products' => Product::where('is_active', true)->get(),
            'roomTypes' => \App\Models\Room::select('type')->distinct()->whereNotNull('type')->pluck('type'),
            'machines' => \App\Models\Machine::where('is_active', true)->get(),
            'roles' => \Spatie\Permission\Models\Role::where('guard_name', 'staff')->pluck('name'),
            'medicines' => \App\Models\Medicine::all(),
            'consumables' => \App\Models\Consumable::all(),
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
            'campaign_flag' => 'boolean',
            'publish_start_at' => 'nullable|date',
            'publish_end_at' => 'nullable|date|after:publish_start_at',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,id',
            'items' => 'nullable|array',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|in:medicine,consumable',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $menu->update($request->except(['product_ids', 'items']));

        if ($request->has('product_ids')) {
            $menu->products()->sync($request->product_ids);
        }

        if ($request->has('items')) {
            $menu->items()->delete(); // Clear existing items
            foreach ($request->items as $item) {
                $modelClass = $item['type'] === 'medicine' ? \App\Models\Medicine::class : \App\Models\Consumable::class;
                $menu->items()->create([
                    'item_id' => $item['id'],
                    'item_type' => $modelClass,
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        return redirect()->route('staff.menus.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy(Menu $menu)
    {
        $menu->delete();
        return redirect()->route('staff.menus.index')->with('success', 'Menu deleted successfully.');
    }
}
