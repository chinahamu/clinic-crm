<?php

namespace App\Observers;

use App\Jobs\PatientValueCalculateJob;
use App\Jobs\ScheduleScenarioJob;
use App\Models\Reservation;

class ReservationObserver
{
    /**
     * Reservation のステータスが "visited" に変更されたときに実行する処理:
     *
     * [Phase 1] PatientValue を非同期再計算
     * [Phase 3] 来院トリガー型でシナリオをスケジュール
     */
    public function updated(Reservation $reservation): void
    {
        if (!$reservation->isDirty('status') || $reservation->status !== 'visited') {
            return;
        }

        // ------ Phase 1 ------
        PatientValueCalculateJob::dispatch($reservation->user_id)
            ->onQueue('default');

        // ------ Phase 3 ------
        // 来院回数をカウントしてトリガー型を判定
        // 注意: count() 実行時点では既に当該予約が visited に変更されているため
        //       count() == 1 が初回来院
        $visitCount = Reservation::where('user_id', $reservation->user_id)
            ->where('status', 'visited')
            ->count();

        $triggerType = ($visitCount === 1) ? 'after_first_visit' : 'after_visit';

        ScheduleScenarioJob::dispatch(
            $reservation->user_id,
            $triggerType,
            ['reservation_id' => $reservation->id]
        )->onQueue('default');
    }
}
