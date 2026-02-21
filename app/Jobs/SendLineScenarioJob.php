<?php

namespace App\Jobs;

use App\Models\StepMailLog;
use App\Services\LineMessagingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendLineScenarioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** LINE API のレートリミットに対応しバックオフ付きリトライ */
    public int   $tries  = 3;
    public int   $backoff = 60;

    public function __construct(private readonly int $stepMailLogId) {}

    public function handle(LineMessagingService $line): void
    {
        $log  = StepMailLog::with('user')->find($this->stepMailLogId);

        if (!$log) {
            Log::warning("SendLineScenarioJob: StepMailLog#{$this->stepMailLogId} が存在しません");
            return;
        }

        // 既に sent/skipped なら重複実行しない
        if (in_array($log->status, ['sent', 'skipped'], true)) {
            return;
        }

        $user = $log->user;

        // line_id 未設定の場合は skipped にして終了
        if (empty($user?->line_id)) {
            $log->update(['status' => 'skipped']);
            Log::info("SendLineScenarioJob: line_id 未設定のためスキップ", [
                'step_mail_log_id' => $this->stepMailLogId,
                'user_id'          => $user?->id,
            ]);
            return;
        }

        $success = $line->pushMessage($user->line_id, $log->rendered_message ?? '');

        $log->update([
            'status'  => $success ? 'sent' : 'failed',
            'sent_at' => $success ? now() : null,
        ]);

        Log::info(
            $success
                ? "SendLineScenarioJob: 送信成功 (StepMailLog#{$this->stepMailLogId})"
                : "SendLineScenarioJob: 送信失敗 (StepMailLog#{$this->stepMailLogId})"
        );
    }

    public function failed(\Throwable $exception): void
    {
        // 全リトライ失敗時は failed に更新
        StepMailLog::find($this->stepMailLogId)?->update(['status' => 'failed']);

        Log::error('SendLineScenarioJob 最終失敗', [
            'step_mail_log_id' => $this->stepMailLogId,
            'error'            => $exception->getMessage(),
        ]);
    }
}
