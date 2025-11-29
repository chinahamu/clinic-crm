<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        // デフォルトで今週のシフトを表示
        // デフォルトを「本日から1週間（本日 + 6日）」に変更
        if ($request->input('start')) {
            $start = Carbon::parse($request->input('start'));
        } else {
            $start = Carbon::today();
        }

        if ($request->input('end')) {
            $end = Carbon::parse($request->input('end'));
        } elseif ($request->input('start')) {
            // start が指定されているが end が無ければ start から1週間表示
            $end = Carbon::parse($request->input('start'))->addDays(6);
        } else {
            $end = Carbon::today()->addDays(6);
        }

        $query = Reservation::with(['user', 'menu.items.item', 'staff', 'room', 'machine', 'items.item'])
            ->whereBetween('start_time', [$start, $end]);

        if ($request->filled('patient_id')) {
            $query->where('user_id', $request->input('patient_id'));
        }

        $reservations = $query->get()
            ->map(function ($reservation) {
                // メニューに紐付いたデフォルトアイテム
                $defaultItems = $reservation->menu->items->map(function ($menuItem) {
                    return [
                        'id' => $menuItem->item_id,
                        'type' => $menuItem->item_type === \App\Models\Medicine::class ? 'medicine' : 'consumable',
                        'quantity' => $menuItem->quantity,
                        'name' => $menuItem->item ? $menuItem->item->name : 'Unknown',
                        'unit' => $menuItem->item ? $menuItem->item->unit : '',
                    ];
                });

                // 既に保存されている予約アイテム
                $reservationItems = $reservation->items->map(function ($resItem) {
                    return [
                        'id' => $resItem->item_id,
                        'type' => $resItem->item_type === \App\Models\Medicine::class ? 'medicine' : 'consumable',
                        'quantity' => $resItem->quantity,
                        'name' => $resItem->item ? $resItem->item->name : 'Unknown',
                        'unit' => $resItem->item ? $resItem->item->unit : '',
                    ];
                });

                return [
                    'id' => $reservation->id,
                    'title' => $reservation->user->name . ' (' . $reservation->menu->name . ')',
                    'start' => $reservation->start_time->toIso8601String(),
                    'end' => $reservation->end_time->toIso8601String(),
                    'user_name' => $reservation->user->name,
                    'menu_name' => $reservation->menu->name,
                    'staff_name' => $reservation->staff ? $reservation->staff->name : '未定',
                    'room_name' => $reservation->room ? $reservation->room->name : '未定',
                    'machine_name' => $reservation->machine ? $reservation->machine->name : 'なし',
                    'status' => $reservation->status,
                    'reception_status' => $reservation->reception_status,
                    'default_items' => $defaultItems,
                    'reservation_items' => $reservationItems,
                ];
            });

        // 患者リスト（全ユーザーまたは患者ロールを持つユーザー）
        // ここでは全ユーザーを取得していますが、必要に応じてロールで絞り込んでください
        $patientList = \App\Models\User::all();

        return Inertia::render('Staff/Reservations/Index', [
            'reservations' => $reservations,
            'patientList' => $patientList,
            'currentStart' => $start->toDateString(),
            'currentEnd' => $end->toDateString(),
            'filters' => $request->only(['patient_id']),
            'medicines' => \App\Models\Medicine::all(),
            'consumables' => \App\Models\Consumable::all(),
        ]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $request->validate([
            'reception_status' => 'required|string',
            'items' => 'nullable|array',
            'items.*.id' => 'required|integer',
            'items.*.type' => 'required|in:medicine,consumable',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $previousStatus = $reservation->reception_status;
        $newStatus = $request->reception_status;

        \Illuminate\Support\Facades\DB::transaction(function () use ($reservation, $request, $previousStatus, $newStatus) {
            $reservation->update([
                'reception_status' => $newStatus,
            ]);

            // ステータスが「完了」に変更された場合、または「完了」状態でアイテムが更新された場合
            if ($newStatus === 'completed') {
                // 既存の予約アイテムを取得して、在庫を戻す（更新の場合）
                if ($reservation->items()->exists()) {
                    foreach ($reservation->items as $existingItem) {
                        $stock = $existingItem->item->stock;
                        if ($stock) {
                            $stock->increment('quantity', $existingItem->quantity);
                        }
                    }
                    $reservation->items()->delete();
                }

                // 新しいアイテムを保存し、在庫を減らす
                if ($request->has('items')) {
                    foreach ($request->items as $itemData) {
                        $modelClass = $itemData['type'] === 'medicine' ? \App\Models\Medicine::class : \App\Models\Consumable::class;
                        
                        // 予約アイテム保存
                        $reservation->items()->create([
                            'item_id' => $itemData['id'],
                            'item_type' => $modelClass,
                            'quantity' => $itemData['quantity'],
                        ]);

                        // 在庫減算
                        $itemModel = $modelClass::find($itemData['id']);
                        if ($itemModel && $itemModel->stock) {
                            $itemModel->stock->decrement('quantity', $itemData['quantity']);
                        }
                    }
                }
            } elseif ($previousStatus === 'completed' && $newStatus !== 'completed') {
                // 「完了」から別のステータスに戻った場合、在庫を戻す
                if ($reservation->items()->exists()) {
                    foreach ($reservation->items as $existingItem) {
                        $stock = $existingItem->item->stock;
                        if ($stock) {
                            $stock->increment('quantity', $existingItem->quantity);
                        }
                    }
                    $reservation->items()->delete();
                }
            }
        });

        return redirect()->back()->with('success', 'Status updated.');
    }
}
