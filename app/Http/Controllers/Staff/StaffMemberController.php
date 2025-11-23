<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClinicRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class StaffMemberController extends Controller
{
    public function index()
    {
        $user = auth()->guard('staff')->user();
        
        $query = Staff::with(['roles', 'clinic']);

        if (!$user->hasRole('hq')) {
             $query->where('clinic_id', $user->clinic_id);
        }

        $staffMembers = $query->get();

        return Inertia::render('Staff/Members/Index', [
            'staffMembers' => $staffMembers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Staff/Members/Create', [
            // 画面にはクリニック別のロールマスタを渡す
            'clinicRoles' => ClinicRole::with('role')
                ->when(!auth()->guard('staff')->user()->hasRole('hq'), function ($q) {
                    $q->where('clinic_id', auth()->guard('staff')->user()->clinic_id);
                })->get(),
            'clinics' => Clinic::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:staff',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'clinic_role_id' => 'required|exists:clinic_roles,id',
            'clinic_id' => 'required|exists:clinics,id',
        ]);

        $staff = Staff::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'clinic_id' => $request->clinic_id,
        ]);

        $clinicRole = ClinicRole::with('role')->findOrFail($request->clinic_role_id);
        // Spatie のロール名で割り当て
        $staff->assignRole($clinicRole->role->name);

        return redirect()->route('staff.members.index');
    }

    public function edit(Staff $member)
    {
        // 編集時は該当クリニックの clinic_role を特定して画面へ渡す
        $member->load(['roles', 'clinic']);
        $selectedClinicRoleId = null;
        if (count($member->roles) > 0) {
            $roleName = $member->roles[0]->name;
            $selectedClinicRoleId = ClinicRole::where('clinic_id', $member->clinic_id)
                ->whereHas('role', function ($q) use ($roleName) {
                    $q->where('name', $roleName);
                })->value('id');
        }

        return Inertia::render('Staff/Members/Edit', [
            'member' => $member->setAttribute('clinic_role_id', $selectedClinicRoleId),
            'clinicRoles' => ClinicRole::with('role')
                ->when(!auth()->guard('staff')->user()->hasRole('hq'), function ($q) {
                    $q->where('clinic_id', auth()->guard('staff')->user()->clinic_id);
                })->get(),
            'clinics' => Clinic::all(),
        ]);
    }

    public function update(Request $request, Staff $member)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:staff,email,' . $member->id,
            'clinic_role_id' => 'required|exists:clinic_roles,id',
            'clinic_id' => 'required|exists:clinics,id',
        ]);

        $member->update([
            'name' => $request->name,
            'email' => $request->email,
            'clinic_id' => $request->clinic_id,
        ]);

        if ($request->filled('password')) {
             $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $member->update(['password' => Hash::make($request->password)]);
        }

        $clinicRole = ClinicRole::with('role')->findOrFail($request->clinic_role_id);
        $member->syncRoles([$clinicRole->role->name]);

        return redirect()->route('staff.members.index');
    }

    public function destroy(Staff $member)
    {
        $member->delete();
        return redirect()->route('staff.members.index');
    }
}
