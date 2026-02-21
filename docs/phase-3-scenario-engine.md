# Phase 3：シナリオ自動実行エンジン

**期間**：3週間  
**優先度**：🔴 最高  
**依存関係**：Phase 2（line_uid バインド）完了後

---

## 目的

`MailScenario` / `StepMailLog` のモデル構造は既存だが、**実行エンジンがない**。  
「来院後N日に自動でLINEを送る」というCRMのコア機能をここで完成させる。

---

## データ構造前提確認

### MailScenario（既存）

`MailScenario` に以下のカラムが揃っているか確認。不足分はマイグレーション追加：

```php
// 確認・追加が必要なカラム
Schema::table('mail_scenarios', function (Blueprint $table) {
    $table->string('trigger_type')
          ->comment('after_first_visit / after_visit / no_visit_60d / birthday / course_low');
    $table->integer('delay_days')->default(0)
          ->comment('トリガーから何日後に送るか');
    $table->text('message_template')
          ->comment('{{患者名}} {{メニュー名}} などの差し込み変数を使用可能');
    $table->boolean('is_active')->default(true);
    $table->foreignId('clinic_id')->nullable()->constrained()->nullOnDelete();
});
```

### StepMailLog（既存）

```php
Schema::table('step_mail_logs', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->foreignId('mail_scenario_id')->constrained()->cascadeOnDelete();
    $table->timestamp('scheduled_at');
    $table->timestamp('sent_at')->nullable();
    $table->string('status')->default('scheduled')
          ->comment('scheduled / sent / failed / skipped');
    $table->text('rendered_message')->nullable()
          ->comment('差し込み変数を展開済みのメッセージ本文');
});
```

---

## 実装タスク

### 1. ScheduleScenarioJob：シナリオをスケジュールに追加

```php
// app/Jobs/ScheduleScenarioJob.php
<?php

namespace App\Jobs;

use App\Models\MailScenario;
use App\Models\StepMailLog;
use App\Models\User;
use App\Services\MessageContentService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ScheduleScenarioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private int    $userId,
        private string $triggerType,
        private array  $context = []
    ) {}

    public function handle(MessageContentService $contentService): void
    {
        $user      = User::findOrFail($this->userId);
        $scenarios = MailScenario::where('trigger_type', $this->triggerType)
            ->where('is_active', true)
            ->get();

        foreach ($scenarios as $scenario) {
            // 重複スケジュール防止
            $alreadyScheduled = StepMailLog::where('user_id', $this->userId)
                ->where('mail_scenario_id', $scenario->id)
                ->whereIn('status', ['scheduled', 'sent'])
                ->exists();

            if ($alreadyScheduled) continue;

            $scheduledAt      = now()->addDays($scenario->delay_days);
            $renderedMessage  = $contentService->render($scenario->message_template, $user, $this->context);

            StepMailLog::create([
                'user_id'          => $this->userId,
                'mail_scenario_id' => $scenario->id,
                'scheduled_at'     => $scheduledAt,
                'rendered_message' => $renderedMessage,
                'status'           => 'scheduled',
            ]);
        }
    }
}
```

---

### 2. SendScheduledScenarios：定期実行コマンド

```php
// app/Console/Commands/SendScheduledScenarios.php
<?php

namespace App\Console\Commands;

use App\Jobs\SendLineScenarioJob;
use App\Models\StepMailLog;
use Illuminate\Console\Command;

class SendScheduledScenarios extends Command
{
    protected $signature   = 'scenarios:send-scheduled';
    protected $description = '送信予定時刻を過ぎた StepMailLog を LINE 配信する';

    public function handle(): void
    {
        $logs = StepMailLog::where('status', 'scheduled')
            ->where('scheduled_at', '<=', now())
            ->with(['user', 'mailScenario'])
            ->get();

        $this->info("対象件数: {$logs->count()}");

        foreach ($logs as $log) {
            // line_uid が未設定の場合はスキップ
            if (empty($log->user->line_uid)) {
                $log->update(['status' => 'skipped']);
                continue;
            }
            SendLineScenarioJob::dispatch($log->id);
        }
    }
}
```

スケジューラに登録（`app/Console/Kernel.php`）：

```php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('scenarios:send-scheduled')->hourly();
    $schedule->command('patients:recalculate-values')->dailyAt('02:00');
}
```

---

### 3. SendLineScenarioJob：実際の LINE 送信

```php
// app/Jobs/SendLineScenarioJob.php
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

    public int $tries   = 3;
    public int $backoff = 60; // 60秒後にリトライ

    public function __construct(private int $stepMailLogId) {}

    public function handle(LineMessagingService $line): void
    {
        $log  = StepMailLog::with('user')->findOrFail($this->stepMailLogId);
        $user = $log->user;

        if (empty($user->line_uid)) {
            $log->update(['status' => 'skipped']);
            return;
        }

        $success = $line->pushMessage($user->line_uid, $log->rendered_message);

        $log->update([
            'status'  => $success ? 'sent' : 'failed',
            'sent_at' => $success ? now() : null,
        ]);

        if (!$success) {
            Log::error("LINE 送信失敗: StepMailLog#{$this->stepMailLogId}");
        }
    }

    public function failed(\Throwable $exception): void
    {
        StepMailLog::find($this->stepMailLogId)?->update(['status' => 'failed']);
        Log::error("SendLineScenarioJob 失敗: " . $exception->getMessage());
    }
}
```

---

### 4. MessageContentService 改修（差し込み変数の拡充）

```php
// app/Services/MessageContentService.php（改修）
<?php

namespace App\Services;

use App\Models\User;

class MessageContentService
{
    /**
     * テンプレートに差し込み変数を展開する
     *
     * 使用可能な変数:
     *   {{患者名}}          患者の氏名
     *   {{敬称}}            様
     *   {{来院日}}          最終来院日（Y年m月d日）
     *   {{次回メニュー}}    直近の予約メニュー名
     *   {{クリニック名}}    所属クリニック名
     *
     * @param array $context ['menu_name' => '...', ...]
     */
    public function render(string $template, User $user, array $context = []): string
    {
        $lastVisit = $user->reservations()
            ->where('status', 'visited')
            ->latest('start_time')
            ->first();

        $replacements = [
            '{{患者名}}'       => $user->name ?? 'お客様',
            '{{敬称}}'         => '様',
            '{{来院日}}'       => $lastVisit?->start_time?->format('Y年m月d日') ?? '',
            '{{次回メニュー}}' => $context['menu_name'] ?? '',
            '{{クリニック名}}' => $context['clinic_name'] ?? '',
        ];

        return str_replace(
            array_keys($replacements),
            array_values($replacements),
            $template
        );
    }
}
```

---

### 5. ReservationObserver にシナリオトリガーを追加

Phase 1 で作成した `ReservationObserver` を拡張：

```php
// app/Observers/ReservationObserver.php（更新）
public function updated(Reservation $reservation): void
{
    if (!$reservation->isDirty('status') || $reservation->status !== 'visited') return;

    // Phase 1: PatientValue 再計算
    PatientValueCalculateJob::dispatch($reservation->user_id);

    // Phase 3: シナリオスケジュール
    $visitCount = \App\Models\Reservation::where('user_id', $reservation->user_id)
        ->where('status', 'visited')->count();

    $triggerType = $visitCount === 1 ? 'after_first_visit' : 'after_visit';

    ScheduleScenarioJob::dispatch($reservation->user_id, $triggerType, [
        'menu_name'    => $reservation->menu?->name,
        'clinic_name'  => $reservation->clinic?->name,
    ]);
}
```

---

## 標準シナリオ例（シードデータ）

```php
// database/seeders/DefaultScenariosSeeder.php
$scenarios = [
    [
        'trigger_type'     => 'after_first_visit',
        'delay_days'       => 3,
        'message_template' => "{{患者名}}{{敬称}}\n\n先日はご来院いただきありがとうございました。\nご不明な点やお気になることがあれば、いつでもご連絡ください。\n\n次回のご来院もお待ちしております。",
        'is_active'        => true,
    ],
    [
        'trigger_type'     => 'after_visit',
        'delay_days'       => 30,
        'message_template' => "{{患者名}}{{敬称}}\n\nご来院から1ヶ月が経ちました。\n{{次回メニュー}}の効果はいかがでしょうか？\n\n次回のご予約はこちらから承っております。",
        'is_active'        => true,
    ],
    [
        'trigger_type'     => 'no_visit_60d',
        'delay_days'       => 0,
        'message_template' => "{{患者名}}{{敬称}}\n\nお久しぶりです。{{クリニック名}}です。\nその後いかがお過ごしでしょうか？\n\n期間限定のキャンペーンをご用意しております。ぜひご来院ください。",
        'is_active'        => true,
    ],
];
```

---

## 完了判定

- [ ] `Reservation.status` を `visited` に変更すると `StepMailLog` に行が作成される
- [ ] `php artisan scenarios:send-scheduled` 実行で送信予定のLINEが届く
- [ ] スケジューラが毎時間コマンドを実行している（`php artisan schedule:work` で確認）
- [ ] `{{患者名}}` 等の差し込み変数が正しく展開されている
- [ ] 送信失敗時に `StepMailLog.status = failed` になり3回リトライされる
- [ ] `line_uid` 未設定患者は `skipped` になりエラーが出ない
