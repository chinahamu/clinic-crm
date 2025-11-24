<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContractController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $patient)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'contract_date' => 'required|date',
            'payment_status' => 'nullable|string', // paid, unpaid, etc.
        ]);

        $menu = Menu::findOrFail($validated['menu_id']);

        DB::transaction(function () use ($patient, $menu, $validated) {
            $contract = new Contract();
            $contract->user_id = $patient->id;
            $contract->menu_id = $menu->id;
            $contract->clinic_id = auth()->guard('staff')->user()->clinic_id; // Assuming staff belongs to a clinic
            $contract->contract_date = $validated['contract_date'];
            $contract->total_count = $menu->num_tickets ?? 1;
            $contract->remaining_count = $menu->num_tickets ?? 1;
            $contract->total_price = $menu->price;
            
            if ($menu->validity_period_days) {
                $contract->expiration_date = \Carbon\Carbon::parse($validated['contract_date'])->addDays($menu->validity_period_days);
            }

            $contract->status = 'active';
            $contract->save();

            // Log activity?
            activity()
                ->performedOn($contract)
                ->causedBy(auth()->guard('staff')->user())
                ->log('created_contract');
        });

        return redirect()->back()->with('success', '契約を作成しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contract $contract)
    {
        $contract->delete();
        return redirect()->back()->with('success', '契約を削除しました。');
    }
}
