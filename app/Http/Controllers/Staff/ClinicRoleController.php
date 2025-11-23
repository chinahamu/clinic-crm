<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ClinicRole;
use App\Models\Clinic;
use Spatie\Permission\Models\Role;

class ClinicRoleController extends Controller
{
    public function index()
    {
        // HQ 以外は自分のクリニックの clinic_roles のみ表示
        $user = auth()->guard('staff')->user();
        $query = ClinicRole::with(['clinic', 'role']);

        if (!($user && $user->hasRole('hq'))) {
            $query->where('clinic_id', $user->clinic_id);
        }

        $clinicRoles = $query->get();

        return Inertia::render('Staff/ClinicRoles/Index', [
            'clinicRoles' => $clinicRoles,
        ]);
    }

    public function create()
    {
        $user = auth()->guard('staff')->user();
        $roles = Role::where('guard_name', 'staff')->get();

        // HQ は全クリニック、そうでなければ自分の clinic のみ
        if ($user && $user->hasRole('hq')) {
            $clinics = Clinic::all();
        } else {
            $clinics = Clinic::where('id', $user->clinic_id)->get();
        }

        return Inertia::render('Staff/ClinicRoles/Create', [
            'clinics' => $clinics,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'clinic_id' => 'required|exists:clinics,id',
            'role_id' => 'required|exists:roles,id',
            'label' => 'nullable|string|max:255',
        ]);

        $user = auth()->guard('staff')->user();
        // 権限がない場合は clinic_id を強制上書き
        if (!($user && $user->hasRole('hq'))) {
            $clinicId = $user->clinic_id;
        } else {
            $clinicId = $request->clinic_id;
        }

        ClinicRole::create([
            'clinic_id' => $clinicId,
            'role_id' => $request->role_id,
            'label' => $request->label,
        ]);

        return redirect()->route('staff.clinic-roles.index');
    }

    public function edit(ClinicRole $clinicRole)
    {
        $user = auth()->guard('staff')->user();
        $roles = Role::where('guard_name', 'staff')->get();

        // 非 HQ は他クリニックの clinicRole 編集を禁止
        if (!($user && $user->hasRole('hq')) && $clinicRole->clinic_id !== $user->clinic_id) {
            abort(403);
        }

        if ($user && $user->hasRole('hq')) {
            $clinics = Clinic::all();
        } else {
            $clinics = Clinic::where('id', $user->clinic_id)->get();
        }

        return Inertia::render('Staff/ClinicRoles/Edit', [
            'clinicRole' => $clinicRole->load(['clinic', 'role']),
            'clinics' => $clinics,
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, ClinicRole $clinicRole)
    {
        $request->validate([
            'clinic_id' => 'required|exists:clinics,id',
            'role_id' => 'required|exists:roles,id',
            'label' => 'nullable|string|max:255',
        ]);

        $user = auth()->guard('staff')->user();
        if (!($user && $user->hasRole('hq'))) {
            // 非 HQ は自分の clinic にのみ更新可能
            if ($clinicRole->clinic_id !== $user->clinic_id) {
                abort(403);
            }
            $clinicId = $user->clinic_id;
        } else {
            $clinicId = $request->clinic_id;
        }

        $clinicRole->update([
            'clinic_id' => $clinicId,
            'role_id' => $request->role_id,
            'label' => $request->label,
        ]);

        return redirect()->route('staff.clinic-roles.index');
    }

    public function destroy(ClinicRole $clinicRole)
    {
        $clinicRole->delete();
        return redirect()->route('staff.clinic-roles.index');
    }
}
