<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Menu;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function index(User $patient)
    {
        $contracts = $patient->contracts()
            ->with(['menu', 'clinic'])
            ->orderByDesc('created_at')
            ->get();

        $menus = Menu::where('is_active', true)->get();

        return Inertia::render('Staff/Contracts/Index', [
            'patient' => $patient,
            'contracts' => $contracts,
            'menus' => $menus,
        ]);
    }

    public function store(Request $request, User $patient)
    {
        $validated = $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'contract_date' => 'required|date',
            'total_count' => 'required|integer|min:1',
            'total_price' => 'required|integer|min:0',
            'expiration_date' => 'nullable|date|after:contract_date',
        ]);

        $patient->contracts()->create([
            'menu_id' => $validated['menu_id'],
            'clinic_id' => auth()->guard('staff')->user()->clinic_id,
            'contract_date' => $validated['contract_date'],
            'total_count' => $validated['total_count'],
            'remaining_count' => $validated['total_count'],
            'total_price' => $validated['total_price'],
            'expiration_date' => $validated['expiration_date'],
            'status' => 'active',
        ]);

        return redirect()->back()->with('success', '契約を作成しました。');
    }

    public function storeUsage(Request $request, User $patient, Contract $contract)
    {
        $validated = $request->validate([
            'used_count' => 'required|integer|min:1',
            'used_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        if ($contract->remaining_count < $validated['used_count']) {
            return redirect()->back()->withErrors(['used_count' => '残回数が不足しています。']);
        }

        $contract->usages()->create([
            'used_count' => $validated['used_count'],
            'used_date' => $validated['used_date'],
            'notes' => $validated['notes'],
        ]);

        $contract->decrement('remaining_count', $validated['used_count']);

        if ($contract->remaining_count <= 0) {
            $contract->update(['status' => 'completed']);
        }

        return redirect()->back()->with('success', '消化を記録しました。');
    }

    public function show(User $patient, Contract $contract)
    {
        $contract->load(['menu', 'clinic', 'usages.reservation']);

        return Inertia::render('Staff/Contracts/Show', [
            'patient' => $patient,
            'contract' => $contract,
        ]);
    }

    public function destroy(User $patient, Contract $contract)
    {
        $contract->delete();
        return redirect()->back()->with('success', '契約を削除しました。');
    }
}
