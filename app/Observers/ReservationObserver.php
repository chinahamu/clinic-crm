<?php

namespace App\Observers;

use App\Jobs\PatientValueCalculateJob;
use App\Models\Reservation;

class ReservationObserver
{
    /**
     * Reservationのステータスが "visited" に変更されたときに
     * PatientValue を非同期再計算する。
     */
    public function updated(Reservation $reservation): void
    {
        if ($reservation->isDirty('status') && $reservation->status === 'visited') {
            PatientValueCalculateJob::dispatch($reservation->user_id)
                ->onQueue('default');
        }
    }
}
