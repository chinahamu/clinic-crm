<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// -----------------------------------------------------------------------
// Phase 1: 患者 LTV 日次再計算 (毎日午前 2 時)
// -----------------------------------------------------------------------
Schedule::command('patients:recalculate-values')->dailyAt('02:00');

// -----------------------------------------------------------------------
// Phase 3: シナリオ配信スケジューラー (毎時実行)
// -----------------------------------------------------------------------
Schedule::command('scenarios:send-scheduled')->hourly();
