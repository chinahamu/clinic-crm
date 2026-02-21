<?php

namespace App\Providers;

use App\Models\Reservation;
use App\Observers\ReservationObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Phase 1: visited 変更時に PatientValue を自動再計算
        Reservation::observe(ReservationObserver::class);
    }
}
