# Phase 1：PatientValue 自動更新基盤

**期間**：2週間  
**優先度**：🟡 高  
**依存関係**：なし（単独着手可能）

---

## 目的

`PatientValue` モデルは定義済みだが、値の自動更新機構がない。  
来院ステータスが `visited` に変わった際に LTV・来院回数・最終来院日を自動再計算し、  
`PatientFilterService` のクエリパフォーマンスを改善する。

---

## 現状の課題

`PatientFilterService::apply()` の `min_total_sales` フィルターが毎回サブクエリを発行している：

```php
// 現状（app/Services/PatientFilterService.php）
$query->whereRaw(
    '(SELECT COALESCE(SUM(total_price), 0) FROM contracts WHERE contracts.user_id = users.id) >= ?',
    [$filters['min_total_sales']]
);
```

患者数が増えると全件スキャンになりパフォーマンスが劣化する。

---

## 実装タスク

### 1. マイグレーション確認・追加

`patient_values` テーブルに以下のカラムが揃っているか確認。不足があれば追加する。

```php
// database/migrations/xxxx_update_patient_values_table.php
Schema::table('patient_values', function (Blueprint $table) {
    $table->unsignedBigInteger('ltv')->default(0)->comment('累計支払額（円）');
    $table->unsignedInteger('visit_count')->default(0)->comment('来院回数');
    $table->timestamp('last_visit_at')->nullable()->comment('最終来院日時');
    $table->string('status_label')->default('active')
          ->comment('active / dormant / new');
});
```

---

### 2. ReservationObserver 新規作成

```php
// app/Observers/ReservationObserver.php
<?php

namespace App\Observers;

use App\Jobs\PatientValueCalculateJob;
use App\Models\Reservation;

class ReservationObserver
{
    public function updated(Reservation $reservation): void
    {
        if ($reservation->isDirty('status') && $reservation->status === 'visited') {
            PatientValueCalculateJob::dispatch($reservation->user_id)
                ->onQueue('default');
        }
    }
}
```

`AppServiceProvider::boot()` に登録：

```php
// app/Providers/AppServiceProvider.php
use App\Models\Reservation;
use App\Observers\ReservationObserver;

public function boot(): void
{
    Reservation::observe(ReservationObserver::class);
}
```

---

### 3. PatientValueCalculateJob 新規作成

```php
// app/Jobs/PatientValueCalculateJob.php
<?php

namespace App\Jobs;

use App\Models\PatientValue;
use App\Models\Contract;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class PatientValueCalculateJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private int $userId) {}

    public function handle(): void
    {
        $ltv = Contract::where('user_id', $this->userId)->sum('total_price');

        $visitCount = Reservation::where('user_id', $this->userId)
            ->where('status', 'visited')
            ->count();

        $lastVisitAt = Reservation::where('user_id', $this->userId)
            ->where('status', 'visited')
            ->max('start_time');

        $statusLabel = $this->resolveStatusLabel($lastVisitAt, $visitCount);

        PatientValue::updateOrCreate(
            ['user_id' => $this->userId],
            [
                'ltv'           => $ltv,
                'visit_count'   => $visitCount,
                'last_visit_at' => $lastVisitAt,
                'status_label'  => $statusLabel,
            ]
        );
    }

    private function resolveStatusLabel(?string $lastVisitAt, int $visitCount): string
    {
        if ($visitCount === 0) return 'new';
        if ($lastVisitAt && Carbon::parse($lastVisitAt)->diffInDays(now()) >= 60) return 'dormant';
        return 'active';
    }
}
```

---

### 4. PatientFilterService 改修

```php
// app/Services/PatientFilterService.php（改修箇所のみ）

// Before
$query->whereRaw('(SELECT COALESCE(SUM(total_price), 0) FROM contracts WHERE contracts.user_id = users.id) >= ?', [...]);

// After: patient_values テーブルの事前集計値を参照
if (!empty($filters['min_total_sales'])) {
    $query->whereHas('patientValue', function ($q) use ($filters) {
        $q->where('ltv', '>=', $filters['min_total_sales']);
    });
}

// ステータスラベルフィルターを追加
if (!empty($filters['status_label'])) {
    $query->whereHas('patientValue', function ($q) use ($filters) {
        $q->where('status_label', $filters['status_label']);
    });
}
```

`User` モデルに `patientValue` リレーションを追加：

```php
// app/Models/User.php
public function patientValue(): HasOne
{
    return $this->hasOne(PatientValue::class);
}
```

---

### 5. バッチ再計算コマンド（全患者の初期計算用）

```php
// app/Console/Commands/RecalculateAllPatientValues.php
<?php

namespace App\Console\Commands;

use App\Jobs\PatientValueCalculateJob;
use App\Models\User;
use Illuminate\Console\Command;

class RecalculateAllPatientValues extends Command
{
    protected $signature   = 'patients:recalculate-values';
    protected $description = '全患者の PatientValue を再計算する';

    public function handle(): void
    {
        $count = User::count();
        $this->info("対象患者数: {$count}");

        User::chunk(100, function ($users) {
            foreach ($users as $user) {
                PatientValueCalculateJob::dispatch($user->id);
            }
        });

        $this->info('全ジョブをキューに追加しました。');
    }
}
```

初回リリース時に実行：
```bash
php artisan patients:recalculate-values
```

---

## 完了判定

- [ ] `Reservation` のステータスを `visited` に変更すると `patient_values` が更新される
- [ ] `PatientFilterService` が `patient_values.ltv` を参照するクエリに変わっている
- [ ] `status_label` = `dormant` のフィルターで60日以上未来院患者が抽出できる
- [ ] `php artisan patients:recalculate-values` で既存全患者の再計算が完了する
