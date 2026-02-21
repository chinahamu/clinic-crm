# Phase 4：Filament KPI ダッシュボード

**期間**：2週間  
**優先度**：🟡 高  
**依存関係**：Phase 1（PatientValue）、Phase 3（StepMailLog）完了後が理想的

---

## 目的

クリニック院長・マネージャーが毎朝1画面で経営状態を把握できるダッシュボードを構築する。  
Filamentの `StatsOverviewWidget` と `ChartWidget` を活用してゼロベースのフロント実装を最小化する。

---

## ダッシュボード全体レイアウト

```
┌─────────────────────────────────────────────────────────────────┐
│ [今月の来院数]  [新規患者数]  [月次売上]  [平均LTV]              │  ← StatsOverview
├─────────────────────────────────────────────────────────────────┤
│             来院トレンドグラフ（12ヶ月・新規/リピート積み上げ）   │  ← ChartWidget
├────────────────────────┬────────────────────────────────────────┤
│  メニュー別売上TOP5     │  シナリオ配信効果（開封率・転換率）    │  ← 2カラム
├────────────────────────┴────────────────────────────────────────┤
│  要アクション患者リスト（休眠リスク・コース残少・誕生月）         │  ← TableWidget
└─────────────────────────────────────────────────────────────────┘
```

---

## 実装タスク

### 1. ClinicStatsWidget（KPIカード）

```php
// app/Filament/Widgets/ClinicStatsWidget.php
<?php

namespace App\Filament\Widgets;

use App\Models\Contract;
use App\Models\PatientValue;
use App\Models\Reservation;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Carbon\Carbon;

class ClinicStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $thisMonth  = Carbon::now()->startOfMonth();
        $lastMonth  = Carbon::now()->subMonth()->startOfMonth();

        $visitCount     = Reservation::where('status', 'visited')
            ->where('start_time', '>=', $thisMonth)->count();
        $lastVisitCount = Reservation::where('status', 'visited')
            ->whereBetween('start_time', [$lastMonth, $thisMonth])->count();

        $newPatients     = User::where('created_at', '>=', $thisMonth)->count();
        $lastNewPatients = User::whereBetween('created_at', [$lastMonth, $thisMonth])->count();

        $monthlySales     = Contract::where('created_at', '>=', $thisMonth)->sum('total_price');
        $lastMonthlySales = Contract::whereBetween('created_at', [$lastMonth, $thisMonth])->sum('total_price');

        $avgLtv = PatientValue::avg('ltv') ?? 0;

        return [
            Stat::make('今月の来院数', number_format($visitCount))
                ->description($this->diffDescription($visitCount, $lastVisitCount))
                ->descriptionIcon($visitCount >= $lastVisitCount ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($visitCount >= $lastVisitCount ? 'success' : 'danger'),

            Stat::make('新規患者数', number_format($newPatients))
                ->description($this->diffDescription($newPatients, $lastNewPatients))
                ->color($newPatients >= $lastNewPatients ? 'success' : 'warning'),

            Stat::make('月次売上', '¥' . number_format($monthlySales))
                ->description($this->diffDescription($monthlySales, $lastMonthlySales))
                ->color($monthlySales >= $lastMonthlySales ? 'success' : 'danger'),

            Stat::make('患者平均LTV', '¥' . number_format((int) $avgLtv))
                ->description('累計支払額の平均')
                ->color('info'),
        ];
    }

    private function diffDescription(int|float $current, int|float $last): string
    {
        if ($last === 0) return '先月比 データなし';
        $diff = round((($current - $last) / $last) * 100, 1);
        $sign = $diff >= 0 ? '+' : '';
        return "先月比 {$sign}{$diff}%";
    }
}
```

---

### 2. VisitTrendChartWidget（来院トレンドグラフ）

```php
// app/Filament/Widgets/VisitTrendChartWidget.php
<?php

namespace App\Filament\Widgets;

use App\Models\Reservation;
use App\Models\User;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class VisitTrendChartWidget extends ChartWidget
{
    protected static ?int    $sort    = 2;
    protected static ?string $heading = '来院トレンド（過去12ヶ月）';
    protected int | string   $columnSpan = 'full';

    protected function getData(): array
    {
        $months = collect(range(11, 0))->map(fn($i) => Carbon::now()->subMonths($i));

        $labels = $months->map(fn($m) => $m->format('Y年n月'))->toArray();

        $newCounts = $months->map(function ($m) {
            return User::whereBetween('created_at', [
                $m->copy()->startOfMonth(),
                $m->copy()->endOfMonth(),
            ])->count();
        })->toArray();

        $repeatCounts = $months->map(function ($m) {
            // 2回目以降の来院
            return Reservation::where('status', 'visited')
                ->whereBetween('start_time', [
                    $m->copy()->startOfMonth(),
                    $m->copy()->endOfMonth(),
                ])
                ->whereIn('user_id', function ($q) use ($m) {
                    $q->select('user_id')
                      ->from('reservations')
                      ->where('status', 'visited')
                      ->where('start_time', '<', $m->copy()->startOfMonth())
                      ->distinct();
                })
                ->count();
        })->toArray();

        return [
            'datasets' => [
                [
                    'label'           => '新規来院',
                    'data'            => $newCounts,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.6)',
                ],
                [
                    'label'           => 'リピート来院',
                    'data'            => $repeatCounts,
                    'backgroundColor' => 'rgba(16, 185, 129, 0.6)',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar'; // 積み上げ棒グラフ
    }
}
```

---

### 3. DormantPatientWidget（休眠・要アクション患者リスト）

```php
// app/Filament/Widgets/DormantPatientWidget.php
<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Services\PatientFilterService;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Carbon\Carbon;

class DormantPatientWidget extends BaseWidget
{
    protected static ?int    $sort    = 4;
    protected static ?string $heading = '要アクション患者（休眠60日以上）';
    protected int | string   $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::query()
                    ->whereHas('patientValue', fn($q) =>
                        $q->where('status_label', 'dormant'))
                    ->with('patientValue')
                    ->orderBy(fn($q) =>
                        $q->select('last_visit_at')
                          ->from('patient_values')
                          ->whereColumn('user_id', 'users.id'))
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('患者名'),
                Tables\Columns\TextColumn::make('patientValue.last_visit_at')
                    ->label('最終来院日')->dateTime('Y/m/d'),
                Tables\Columns\TextColumn::make('patientValue.ltv')
                    ->label('LTV')->money('JPY'),
                Tables\Columns\TextColumn::make('patientValue.visit_count')
                    ->label('来院回数'),
                Tables\Columns\BadgeColumn::make('patientValue.status_label')
                    ->label('ステータス')
                    ->colors(['warning' => 'dormant']),
            ])
            ->actions([
                Tables\Actions\Action::make('send_line')
                    ->label('LINE送信')
                    ->icon('heroicon-o-chat-bubble-left')
                    ->action(function (User $record): void {
                        // 休眠復帰シナリオを即時スケジュール
                        \App\Jobs\ScheduleScenarioJob::dispatch(
                            $record->id, 'no_visit_60d'
                        );
                    }),
            ])
            ->paginated([10, 25]);
    }
}
```

---

### 4. ScenarioEffectWidget（シナリオ配信効果）

```php
// app/Filament/Widgets/ScenarioEffectWidget.php
<?php

namespace App\Filament\Widgets;

use App\Models\StepMailLog;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ScenarioEffectWidget extends BaseWidget
{
    protected static ?int    $sort    = 3;
    protected static ?string $heading = 'シナリオ配信効果（今月）';

    protected function getStats(): array
    {
        $sent    = StepMailLog::where('status', 'sent')
            ->whereMonth('sent_at', now()->month)->count();
        $skipped = StepMailLog::where('status', 'skipped')
            ->whereMonth('created_at', now()->month)->count();
        $failed  = StepMailLog::where('status', 'failed')
            ->whereMonth('created_at', now()->month)->count();

        return [
            Stat::make('今月の配信数', number_format($sent))
                ->color('success'),
            Stat::make('スキップ（LINE未連携）', number_format($skipped))
                ->description('line_uid 未設定患者')
                ->color('warning'),
            Stat::make('送信失敗数', number_format($failed))
                ->color($failed > 0 ? 'danger' : 'success'),
        ];
    }
}
```

---

### 5. ダッシュボードページにウィジェットを登録

```php
// app/Filament/Pages/Dashboard.php（存在しない場合は作成）
<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\ClinicStatsWidget;
use App\Filament\Widgets\DormantPatientWidget;
use App\Filament\Widgets\ScenarioEffectWidget;
use App\Filament\Widgets\VisitTrendChartWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            ClinicStatsWidget::class,
            VisitTrendChartWidget::class,
            ScenarioEffectWidget::class,
            DormantPatientWidget::class,
        ];
    }
}
```

---

## 完了判定

- [ ] ダッシュボードに4枚のKPIカードが表示される
- [ ] 来院トレンドグラフが過去12ヶ月分を表示する
- [ ] 休眠患者リストから1クリックでLINEシナリオをトリガーできる
- [ ] シナリオ配信効果ウィジェットが今月の送信数・失敗数を表示する
- [ ] 先月比のパーセンテージ表示が正しく計算されている
