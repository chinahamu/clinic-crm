<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Staff\Auth\AuthenticatedSessionController as StaffAuthenticatedSessionController;
use App\Http\Controllers\LineWebhookController;

use Inertia\Inertia;

// -----------------------------------------------------------------------
// LINE Messaging API Webhook
// CSRF 除外: withoutMiddleware で個別除外（bootstrap/app.php 修正不要）
// LINE Developers Console の Webhook URL: https://your-domain.com/webhook/line
// -----------------------------------------------------------------------
Route::post('/webhook/line', [LineWebhookController::class, 'handle'])
    ->name('webhook.line')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/features', function () {
    return Inertia::render('FeatureDetail');
})->name('features');

Route::get('/legal/tokushoho', function () {
    return Inertia::render('Legal/Tokushoho');
})->name('legal.tokushoho');

Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy.policy');

Route::get('/company', function () {
    return Inertia::render('Company/Profile');
})->name('company.profile');

Route::post('/inquiry', [\App\Http\Controllers\InquiryController::class, 'store'])->name('inquiry.store');

Route::get('/reservation/{code}', [\App\Http\Controllers\PatientReservationController::class, 'index'])->name('patient.reservation.index');
Route::get('/reservation/{code}/availability', [\App\Http\Controllers\PatientReservationController::class, 'availability'])->name('patient.reservation.availability');

Route::get('/patient/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/patient/login', [\App\Http\Controllers\PatientAuthController::class, 'login'])->name('patient.login');
Route::post('/patient/register', [\App\Http\Controllers\PatientAuthController::class, 'register'])->name('patient.register');
Route::post('/patient/reservation', [\App\Http\Controllers\PatientReservationController::class, 'store'])->name('patient.reservation.store');

Route::get('auth/line', [\App\Http\Controllers\Auth\LineAuthController::class, 'redirectToProvider'])->name('auth.line');
Route::get('auth/line/callback', [\App\Http\Controllers\Auth\LineAuthController::class, 'handleProviderCallback']);

Route::middleware(['auth:web'])->group(function () {
    Route::get('/home', [\App\Http\Controllers\Patient\MyPageController::class, 'index'])->name('home');
    Route::get('/my-page/documents/{document}', [\App\Http\Controllers\Patient\MyPageController::class, 'downloadDocument'])->name('my-page.documents.download');

    // Web Interview
    Route::get('/reservations/{reservation}/interview', [\App\Http\Controllers\Patient\InterviewController::class, 'show'])->name('patient.interview.show');
    Route::post('/reservations/{reservation}/interview', [\App\Http\Controllers\Patient\InterviewController::class, 'store'])->name('patient.interview.store');
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
        Route::get('sales', [\App\Http\Controllers\Staff\SalesController::class, 'index'])->name('sales.index');

        // ---------------------------------------------------------------
        // Phase 4: KPI ダッシュボード
        // GET  /staff/kpi-dashboard
        // ---------------------------------------------------------------
        Route::get('kpi-dashboard', [\App\Http\Controllers\Staff\KpiDashboardController::class, 'index'])->name('kpi-dashboard');

        Route::resource('patients', \App\Http\Controllers\Staff\PatientController::class);
        Route::resource('patients.contracts', \App\Http\Controllers\Staff\ContractController::class);
        Route::get('patients/{patient}/contracts/create-new', [\App\Http\Controllers\Staff\ContractDocumentController::class, 'create'])->name('patients.contracts.create_new');
        Route::post('patients/{patient}/contracts/store-new', [\App\Http\Controllers\Staff\ContractDocumentController::class, 'store'])->name('patients.contracts.store_new');

        // Consent Documents
        Route::get('patients/{patient}/documents/create', [\App\Http\Controllers\Staff\ContractDocumentController::class, 'createConsentDocument'])->name('patients.documents.create');
        Route::post('patients/{patient}/documents', [\App\Http\Controllers\Staff\ContractDocumentController::class, 'storeConsentDocument'])->name('patients.documents.store');

        Route::post('patients/{patient}/contracts/{contract}/usage', [\App\Http\Controllers\Staff\ContractController::class, 'storeUsage'])->name('patients.contracts.usage.store');
        Route::resource('members', \App\Http\Controllers\Staff\StaffMemberController::class);
        Route::resource('clinic-roles', \App\Http\Controllers\Staff\ClinicRoleController::class);
        Route::get('audit-logs', [\App\Http\Controllers\Staff\AuditLogController::class, 'index'])->name('audit-logs.index');

        Route::resource('menus', \App\Http\Controllers\Staff\MenuController::class);
        Route::resource('products', \App\Http\Controllers\Staff\ProductController::class);
        Route::resource('rooms', \App\Http\Controllers\Staff\RoomController::class);
        Route::resource('machines', \App\Http\Controllers\Staff\MachineController::class);
        Route::post('shifts/requests', [\App\Http\Controllers\Staff\ShiftController::class, 'storeRequests'])->name('shifts.requests.store');
        Route::post('shifts/generate', [\App\Http\Controllers\Staff\ShiftController::class, 'generate'])->name('shifts.generate');
        Route::resource('shifts', \App\Http\Controllers\Staff\ShiftController::class);
        Route::resource('reservations', \App\Http\Controllers\Staff\ReservationController::class);

        // Kiosk Check-in
        Route::get('kiosk/check-in', [\App\Http\Controllers\Staff\KioskController::class, 'index'])->name('kiosk.check-in');
        Route::post('kiosk/check-in', [\App\Http\Controllers\Staff\KioskController::class, 'store'])->name('kiosk.check-in.store');

        Route::resource('medicines', \App\Http\Controllers\Staff\MedicineController::class);
        Route::resource('consumables', \App\Http\Controllers\Staff\ConsumableController::class);
        Route::resource('inventories', \App\Http\Controllers\Staff\InventoryController::class)->only(['index', 'create', 'store']);

        Route::resource('documents', \App\Http\Controllers\Staff\DocumentController::class);
        Route::get('patients/{user}/sign', [\App\Http\Controllers\Staff\DocumentController::class, 'sign'])->name('documents.sign');
        Route::post('patients/{user}/sign', [\App\Http\Controllers\Staff\DocumentController::class, 'storeSignature'])->name('documents.storeSignature');
        Route::get('documents/{signedDocument}/download-pdf', [\App\Http\Controllers\Staff\DocumentController::class, 'downloadPdf'])->name('documents.downloadPdf');
        Route::get('signed-documents/{signedDocument}', [\App\Http\Controllers\Staff\DocumentController::class, 'showSigned'])->name('documents.showSigned');

        Route::post('contracts/{contract}/mark-overview-delivered', [\App\Http\Controllers\Staff\ContractController::class, 'markAsOverviewDelivered'])->name('contracts.markOverviewDelivered');

        Route::get('settings/clinic', [\App\Http\Controllers\Staff\ClinicSettingController::class, 'edit'])->name('settings.clinic.edit');
        Route::put('settings/clinic', [\App\Http\Controllers\Staff\ClinicSettingController::class, 'update'])->name('settings.clinic.update');
        Route::resource('settings/mail-scenarios', \App\Http\Controllers\Staff\MailScenarioController::class);
        Route::resource('settings/interviews', \App\Http\Controllers\Staff\InterviewTemplateController::class)
            ->names([
                'index'   => 'settings.interviews.index',
                'create'  => 'settings.interviews.create',
                'store'   => 'settings.interviews.store',
                'show'    => 'settings.interviews.show',
                'edit'    => 'settings.interviews.edit',
                'update'  => 'settings.interviews.update',
                'destroy' => 'settings.interviews.destroy',
            ]);

        // Marketing
        Route::prefix('marketing')->name('marketing.')->group(function () {
            Route::resource('segments', \App\Http\Controllers\Staff\CustomerSegmentController::class);
            Route::get('segments/{segment}/export', [\App\Http\Controllers\Staff\CustomerSegmentController::class, 'export'])->name('segments.export');
        });

        // Narrative Profile
        Route::post('patients/{patient}/values', [\App\Http\Controllers\Staff\PatientNarrativeController::class, 'updateValues'])->name('patients.values.update');
        Route::post('patients/{patient}/life-events', [\App\Http\Controllers\Staff\PatientNarrativeController::class, 'storeLifeEvent'])->name('patients.life-events.store');
        Route::delete('patients/{patient}/life-events/{event}', [\App\Http\Controllers\Staff\PatientNarrativeController::class, 'destroyLifeEvent'])->name('patients.life-events.destroy');
        Route::post('patients/{patient}/narrative-logs', [\App\Http\Controllers\Staff\PatientNarrativeController::class, 'storeNarrative'])->name('patients.narrative-logs.store');

        // Phase 2: LINE バインドトークン発行（受付スタッフ用）
        Route::post(
            'patients/{patient}/issue-line-token',
            [\App\Http\Controllers\Staff\LineBindTokenController::class, 'issue']
        )->name('patients.issue-line-token');

        // ---------------------------------------------------------------
        // Phase 4: スタッフ手動シナリオトリガー
        // POST /staff/patients/{patient}/trigger-scenario
        // ---------------------------------------------------------------
        Route::post(
            'patients/{patient}/trigger-scenario',
            [\App\Http\Controllers\Staff\PatientScenarioController::class, 'trigger']
        )->name('patients.trigger-scenario');
    });
});
