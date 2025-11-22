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
    });
});
