<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Staff\Auth\AuthenticatedSessionController as StaffAuthenticatedSessionController;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/features', function () {
    return Inertia::render('FeatureDetail');
})->name('features');

Route::get('/reservation/{code}', [\App\Http\Controllers\PatientReservationController::class, 'index'])->name('patient.reservation.index');
Route::get('/reservation/{code}/availability', [\App\Http\Controllers\PatientReservationController::class, 'availability'])->name('patient.reservation.availability');

Route::post('/patient/login', [\App\Http\Controllers\PatientAuthController::class, 'login'])->name('patient.login');
Route::post('/patient/register', [\App\Http\Controllers\PatientAuthController::class, 'register'])->name('patient.register');
Route::post('/patient/reservation', [\App\Http\Controllers\PatientReservationController::class, 'store'])->name('patient.reservation.store');

Route::middleware(['auth:web'])->group(function () {
    Route::get('/home', function () {
        $reservations = \App\Models\Reservation::with(['menu', 'clinic'])
            ->where('user_id', auth()->id())
            ->orderBy('start_time', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'reservations' => $reservations,
        ]);
    })->name('home');

    Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store'])->name('reservations.store');
});

Route::get('/reservations/create', [\App\Http\Controllers\ReservationController::class, 'create'])->name('reservations.create');
Route::get('/reservations/availability', [\App\Http\Controllers\ReservationController::class, 'availability'])->name('reservations.availability');

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
        Route::get('dashboard', [\App\Http\Controllers\Staff\DashboardController::class, 'index'])->name('dashboard');

        Route::resource('patients', \App\Http\Controllers\Staff\PatientController::class);
        Route::resource('patients.contracts', \App\Http\Controllers\Staff\ContractController::class);
        Route::post('patients/{patient}/contracts/{contract}/usage', [\App\Http\Controllers\Staff\ContractController::class, 'storeUsage'])->name('patients.contracts.usage.store');
        Route::resource('members', \App\Http\Controllers\Staff\StaffMemberController::class);
        Route::resource('clinic-roles', \App\Http\Controllers\Staff\ClinicRoleController::class);
        Route::get('audit-logs', [\App\Http\Controllers\Staff\AuditLogController::class, 'index'])->name('audit-logs.index');

        Route::resource('menus', \App\Http\Controllers\Staff\MenuController::class);
        Route::resource('products', \App\Http\Controllers\Staff\ProductController::class);
        Route::resource('rooms', \App\Http\Controllers\Staff\RoomController::class);
        Route::resource('machines', \App\Http\Controllers\Staff\MachineController::class);
        Route::resource('shifts', \App\Http\Controllers\Staff\ShiftController::class);
        Route::resource('reservations', \App\Http\Controllers\Staff\ReservationController::class);

        Route::resource('documents', \App\Http\Controllers\Staff\DocumentController::class);
        Route::get('patients/{user}/sign', [\App\Http\Controllers\Staff\DocumentController::class, 'sign'])->name('documents.sign');
        Route::post('patients/{user}/sign', [\App\Http\Controllers\Staff\DocumentController::class, 'storeSignature'])->name('documents.storeSignature');

        Route::get('settings/clinic', [\App\Http\Controllers\Staff\ClinicSettingController::class, 'edit'])->name('settings.clinic.edit');
        Route::put('settings/clinic', [\App\Http\Controllers\Staff\ClinicSettingController::class, 'update'])->name('settings.clinic.update');
    });
});
