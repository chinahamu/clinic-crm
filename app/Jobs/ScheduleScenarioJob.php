<?php

namespace App\Jobs;

use App\Models\MailScenario;
use App\Models\Reservation;
use App\Models\StepMailLog;
use App\Models\User;
use App\Services\MessageContentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ScheduleScenarioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /**
     * @param int                  $userId      対象患者 ID
     * @param string               $triggerType after_first_visit / after_visit / no_visit_60d / birthday
     * @param array<string, mixed> $context     reservation_id など
     */
    public function __construct(
        private readonly int    $userId,
        private readonly string $triggerType,
        private readonly array  $context = []
    ) {}

    public function handle(MessageContentService $contentService): void
    {
        $user = User::find($this->userId);
        if (!$user) {
            Log::warning("ScheduleScenarioJob: user_id={$this->userId} が存在しません");
            return;
        }

        // 予約コンテキストを reservation_id から取得
        $renderContext = $this->buildRenderContext();

        // トリガー属・クリニックにマッチする有効シナリオを検索
        // clinic_id が null の全クリニック共通シナリオも含める
        $scenarios = MailScenario::active()
            ->where('trigger_type', $this->triggerType)
            ->where(function ($q) use ($user) {
                $q->whereNull('clinic_id')
                  ->orWhere('clinic_id', $user->clinic_id);
            })
            ->get();

        foreach ($scenarios as $scenario) {
            // 重複スケジュール防止: 同一シナリオの scheduled/sent が存在すればスキップ
            $alreadyScheduled = StepMailLog::where('user_id', $this->userId)
                ->where('mail_scenario_id', $scenario->id)
                ->whereIn('status', ['scheduled', 'sent'])
                ->exists();

            if ($alreadyScheduled) {
                continue;
            }

            $scheduledAt     = now()->addDays($scenario->days_offset);
            $renderedMessage = $contentService->render($scenario->body, $user, $renderContext);

            StepMailLog::create([
                'user_id'          => $this->userId,
                'mail_scenario_id' => $scenario->id,
                'scheduled_at'     => $scheduledAt,
                'rendered_message' => $renderedMessage,
                'status'           => 'scheduled',
            ]);

            Log::info('StepMailLog 作成', [
                'user_id'          => $this->userId,
                'mail_scenario_id' => $scenario->id,
                'scheduled_at'     => $scheduledAt->toDateTimeString(),
            ]);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ScheduleScenarioJob 失敗', [
            'user_id'      => $this->userId,
            'trigger_type' => $this->triggerType,
            'error'        => $exception->getMessage(),
        ]);
    }

    // ------------------------------------------------------------------
    // Private
    // ------------------------------------------------------------------

    /**
     * reservation_id から menu_name / clinic_name を取得する。
     * リレーションロードは Job 内部で実行（Observerから穎得なし）。
     *
     * @return array<string, string|null>
     */
    private function buildRenderContext(): array
    {
        if (empty($this->context['reservation_id'])) {
            return [];
        }

        $reservation = Reservation::with(['clinic', 'reservationItems.menu'])
            ->find($this->context['reservation_id']);

        return [
            'menu_name'   => $reservation?->reservationItems?->first()?->menu?->name,
            'clinic_name' => $reservation?->clinic?->name,
        ];
    }
}
