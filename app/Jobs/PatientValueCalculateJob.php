<?php

namespace App\Jobs;

use App\Models\Contract;
use App\Models\PatientValue;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class PatientValueCalculateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * 失敗時の最大リトライ回数
     */
    public int $tries = 3;

    public function __construct(private readonly int $userId)
    {
    }

    public function handle(): void
    {
        $user = User::find($this->userId);
        if (!$user) {
            Log::warning("PatientValueCalculateJob: user_id={$this->userId} が存在しません");
            return;
        }

        // LTV: 途中解約のコースも含めた累計支払額
        $ltv = Contract::where('user_id', $this->userId)
            ->sum('total_price');

        // 来院回数: visited の予約のみカウント
        $visitCount = Reservation::where('user_id', $this->userId)
            ->where('status', 'visited')
            ->count();

        // 最終来院日時
        $lastVisitAt = Reservation::where('user_id', $this->userId)
            ->where('status', 'visited')
            ->max('start_time');

        $statusLabel = $this->resolveStatusLabel($lastVisitAt, $visitCount);

        PatientValue::updateOrCreate(
            ['user_id' => $this->userId],
            [
                'ltv'           => (int) $ltv,
                'visit_count'   => $visitCount,
                'last_visit_at' => $lastVisitAt,
                'status_label'  => $statusLabel,
            ]
        );

        Log::info("PatientValue updated: user_id={$this->userId}, ltv={$ltv}, visits={$visitCount}, status={$statusLabel}");
    }

    /**
     * 来院履歴から患者ステータスを判定する
     *
     * new     : 来院回数 0（予約のみで未来院）
     * dormant : 最終来院かり 60日以上経過
     * active  : それ以外
     */
    private function resolveStatusLabel(?string $lastVisitAt, int $visitCount): string
    {
        if ($visitCount === 0) {
            return 'new';
        }

        if ($lastVisitAt && Carbon::parse($lastVisitAt)->diffInDays(now()) >= 60) {
            return 'dormant';
        }

        return 'active';
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("PatientValueCalculateJob失敗: user_id={$this->userId}, error={$exception->getMessage()}");
    }
}
