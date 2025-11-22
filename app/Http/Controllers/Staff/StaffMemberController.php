<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
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
            'roles' => Role::where('guard_name', 'staff')->get(),
            'clinics' => Clinic::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:staff',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'clinic_id' => 'required|exists:clinics,id',
        ]);

        $staff = Staff::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'clinic_id' => $request->clinic_id,
        ]);

        $staff->assignRole($request->role);

        return redirect()->route('staff.members.index');
    }

    public function edit(Staff $member)
    {
        return Inertia::render('Staff/Members/Edit', [
            'member' => $member->load(['roles', 'clinic']),
            'roles' => Role::where('guard_name', 'staff')->get(),
            'clinics' => Clinic::all(),
        ]);
    }

    public function update(Request $request, Staff $member)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:staff,email,' . $member->id,
            'role' => 'required|exists:roles,name',
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

        $member->syncRoles([$request->role]);

        return redirect()->route('staff.members.index');
    }

    public function destroy(Staff $member)
    {
        $member->delete();
        return redirect()->route('staff.members.index');
    }
}
