# Phase 5：AI 機能（要約・チャーン予測）

**期間**：3週間  
**優先度**：🟢 中  
**依存関係**：Phase 1〜4 完了後

---

## 目的

既存の `NarrativeSyncService` を起点に生成AI・機械学習を組み合わせ、  
「次に誰にアプローチすべきか」を自動で提案する**スマートCRM**に昇格させる。

---

## 機能一覧

| 機能 | 概要 | 実装方式 |
|---|---|---|
| AIカルテ要約 | 診療メモをOpenAI APIで100字に要約 | `NarrativeSyncService` 拡張 |
| チャーンスコア | 離脱リスクをスコアリング | Eloquent集計 + 簡易アルゴリズム |
| 配信文案提案 | セグメント×履歴からLINE文案を生成 | OpenAI API |
| 誕生月シナリオ | 誕生日月の患者を自動抽出して配信 | Scheduler + ScheduleScenarioJob |

---

## 実装タスク

### 1. OpenAI 設定追加

```dotenv
# .env.example
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

```php
// config/services.php
'openai' => [
    'key'   => env('OPENAI_API_KEY'),
    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
],
```

composer に OpenAI クライアントを追加：
```bash
composer require openai-php/laravel
```

---

### 2. NarrativeSyncService 拡張（AIカルテ要約）

```php
// app/Services/NarrativeSyncService.php（追記）

use OpenAI\Laravel\Facades\OpenAI;

/**
 * 診療メモをAIで100字以内に要約する
 */
public function summarizeWithAI(NarrativeLog $log): string
{
    if (empty($log->content)) return '';

    $response = OpenAI::chat()->create([
        'model'    => config('services.openai.model'),
        'messages' => [
            [
                'role'    => 'system',
                'content' => 'あなたは医療クリニックのカルテ記録補助AIです。簡潔かつ正確に要約してください。',
            ],
            [
                'role'    => 'user',
                'content' => "以下の診療メモを患者カルテ向けに100字以内で要約してください。\n\n{$log->content}",
            ],
        ],
        'max_tokens' => 200,
    ]);

    $summary = $response->choices[0]->message->content ?? '';

    // 要約を NarrativeLog に保存
    $log->update(['ai_summary' => $summary]);

    return $summary;
}
```

`narrative_logs` テーブルに `ai_summary` カラムを追加：

```php
// database/migrations/xxxx_add_ai_summary_to_narrative_logs.php
Schema::table('narrative_logs', function (Blueprint $table) {
    $table->text('ai_summary')->nullable()->after('content');
});
```

---

### 3. チャーンスコア算出

離脱リスクを「来院間隔の増加率」「コース消化率」「配信未反応」で数値化する。

```php
// app/Services/ChurnScoreService.php（新規）
<?php

namespace App\Services;

use App\Models\User;
use App\Models\Reservation;
use App\Models\StepMailLog;
use Carbon\Carbon;

class ChurnScoreService
{
    /**
     * チャーンスコアを 0〜100 で返す（高いほど離脱リスク大）
     */
    public function calculate(User $user): int
    {
        $score = 0;

        // 1. 最終来院からの経過日数（最大40点）
        $daysSinceVisit = $this->getDaysSinceLastVisit($user);
        $score += min(40, (int) ($daysSinceVisit / 90 * 40));

        // 2. 来院間隔の増加傾向（最大30点）
        $intervalTrend = $this->getIntervalTrend($user);
        $score += $intervalTrend > 1.5 ? 30 : (int) ($intervalTrend * 20);

        // 3. 配信スキップ率（line_uid 未設定 → +20点）
        if (empty($user->line_uid)) $score += 20;

        // 4. コース残回数ゼロで再購入なし（最大10点）
        if ($this->hasExpiredContractWithNoRenewal($user)) $score += 10;

        return min(100, $score);
    }

    private function getDaysSinceLastVisit(User $user): int
    {
        $lastVisit = $user->patientValue?->last_visit_at;
        if (!$lastVisit) return 999;
        return Carbon::parse($lastVisit)->diffInDays(now());
    }

    private function getIntervalTrend(User $user): float
    {
        $intervals = Reservation::where('user_id', $user->id)
            ->where('status', 'visited')
            ->orderBy('start_time')
            ->pluck('start_time')
            ->sliding(2)
            ->map(fn($pair) => Carbon::parse($pair[0])->diffInDays($pair[1]))
            ->values();

        if ($intervals->count() < 2) return 1.0;

        // 直近の間隔 / 平均間隔
        $avg    = $intervals->avg();
        $recent = $intervals->last();
        return $avg > 0 ? $recent / $avg : 1.0;
    }

    private function hasExpiredContractWithNoRenewal(User $user): bool
    {
        // コース残0かつ90日以内に新規契約なし
        return $user->contracts()
            ->whereDoesntHave('contractUsages', fn($q) => $q->whereNull('used_at'))
            ->where('created_at', '<', now()->subDays(90))
            ->exists();
    }
}
```

`patient_values` にチャーンスコアカラムを追加：

```php
// database/migrations/xxxx_add_churn_score_to_patient_values.php
Schema::table('patient_values', function (Blueprint $table) {
    $table->unsignedTinyInteger('churn_score')->default(0)
          ->comment('0-100 高いほど離脱リスク大');
    $table->timestamp('churn_calculated_at')->nullable();
});
```

`PatientValueCalculateJob` にチャーンスコア計算を追加：

```php
// app/Jobs/PatientValueCalculateJob.php（追記）
$churnScore = app(ChurnScoreService::class)->calculate($user);

PatientValue::updateOrCreate(
    ['user_id' => $this->userId],
    [
        // ... 既存カラム ...
        'churn_score'          => $churnScore,
        'churn_calculated_at'  => now(),
    ]
);
```

---

### 4. 配信文案AI提案（Filament Action）

```php
// Filament の患者詳細画面に追加するアクション

Tables\Actions\Action::make('suggest_message')
    ->label('AI文案提案')
    ->icon('heroicon-o-sparkles')
    ->modalHeading('LINE配信文案をAIが提案します')
    ->modalContent(function (User $record): string {
        $history = $record->reservations()
            ->where('status', 'visited')
            ->latest('start_time')
            ->limit(3)
            ->with('menu')
            ->get()
            ->map(fn($r) => $r->menu?->name . '（' . $r->start_time->format('Y/m/d') . '）')
            ->join('、');

        $response = OpenAI::chat()->create([
            'model'    => config('services.openai.model'),
            'messages' => [
                [
                    'role'    => 'system',
                    'content' => 'あなたは美容クリニックのCRMアシスタントです。親しみやすく、医療広告ガイドラインに準拠したLINEメッセージを提案してください。',
                ],
                [
                    'role'    => 'user',
                    'content' => "患者名: {$record->name}\n施術履歴: {$history}\n\nリピート促進のLINEメッセージを150字以内で提案してください。",
                ],
            ],
            'max_tokens' => 300,
        ]);

        return $response->choices[0]->message->content ?? 'AI提案を取得できませんでした。';
    }),
```

---

### 5. 誕生月シナリオ自動配信

```php
// app/Console/Commands/SendBirthdayScenarios.php
<?php

namespace App\Console\Commands;

use App\Jobs\ScheduleScenarioJob;
use App\Models\User;
use Illuminate\Console\Command;

class SendBirthdayScenarios extends Command
{
    protected $signature   = 'scenarios:send-birthday';
    protected $description = '今月誕生日の患者にシナリオをスケジュールする';

    public function handle(): void
    {
        User::whereMonth('birthday', now()->month)
            ->chunk(50, function ($users) {
                foreach ($users as $user) {
                    ScheduleScenarioJob::dispatch($user->id, 'birthday');
                }
            });

        $this->info('誕生月シナリオをスケジュールしました。');
    }
}
```

スケジューラに登録（毎月1日）：

```php
// app/Console/Kernel.php
$schedule->command('scenarios:send-birthday')->monthlyOn(1, '09:00');
```

---

### 6. チャーンスコアバッジを Filament 患者一覧に追加

```php
// Filament の Users Resource テーブルカラムに追加

Tables\Columns\BadgeColumn::make('patientValue.churn_score')
    ->label('離脱リスク')
    ->formatStateUsing(fn($state) => match(true) {
        $state >= 70 => '高',
        $state >= 40 => '中',
        default      => '低',
    })
    ->colors([
        'danger'  => fn($state) => $state >= 70,
        'warning' => fn($state) => $state >= 40 && $state < 70,
        'success' => fn($state) => $state < 40,
    ]),
```

---

## 完了判定

- [ ] `NarrativeLog` 保存時にAI要約が `ai_summary` に記録される
- [ ] 患者一覧に「離脱リスク」バッジ（高/中/低）が表示される
- [ ] 「AI文案提案」アクションで150字以内のLINEメッセージ案が表示される
- [ ] 毎月1日の誕生月シナリオが対象患者全員にスケジュールされる
- [ ] チャーンスコアが `PatientValueCalculateJob` 実行のたびに更新される
