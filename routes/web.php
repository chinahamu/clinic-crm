<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Staff\Auth\AuthenticatedSessionController as StaffAuthenticatedSessionController;

use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth:web'])->group(function () {
    Route::get('/home', function () {
        return Inertia::render('Dashboard');
    })->name('home');

    Route::get('/reservations/create', [\App\Http\Controllers\ReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations/availability', [\App\Http\Controllers\ReservationController::class, 'availability'])->name('reservations.availability');
});

Route::prefix('staff')->name('staff.')->group(function () {
    Route::get('login', [StaffAuthenticatedSessionController::class, 'create'])
        ->middleware('guest:staff')
        ->name('login');

    Route::post('login', [StaffAuthenticatedSessionController::class, 'store'])
        ->middleware('guest:staff');

    Route::post('logout', [StaffAuthenticatedSessionController::class, 'destroy'])
        ->middleware('auth:staff')
        ->name('logout');

    Route::middleware(['auth:staff'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Staff/Dashboard');
        })->name('dashboard');

        Route::resource('patients', \App\Http\Controllers\Staff\PatientController::class);
        Route::resource('members', \App\Http\Controllers\Staff\StaffMemberController::class);
        Route::get('audit-logs', [\App\Http\Controllers\Staff\AuditLogController::class, 'index'])->name('audit-logs.index');

        Route::resource('menus', \App\Http\Controllers\Staff\MenuController::class);
        Route::resource('rooms', \App\Http\Controllers\Staff\RoomController::class);
        Route::resource('machines', \App\Http\Controllers\Staff\MachineController::class);
        Route::resource('shifts', \App\Http\Controllers\Staff\ShiftController::class);
        Route::resource('reservations', \App\Http\Controllers\Staff\ReservationController::class);
    });
});
