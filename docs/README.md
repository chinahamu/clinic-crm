# clinic-crm 改修計画ドキュメント

自由診療クリニック向けCRM の改修フェーズ全体概要。

---

## フェーズ一覧

| フェーズ | タイトル | 期間 | 優先度 |
|---|---|---|---|
| [Phase 1](./phase-1-patient-value.md) | PatientValue 自動更新基盤 | 2週間 | 🟡 高 |
| [Phase 2](./phase-2-line-webhook.md) | LINE Webhook & line_uid バインド | 2週間 | 🔴 最高 |
| [Phase 3](./phase-3-scenario-engine.md) | シナリオ自動実行エンジン | 3週間 | 🔴 最高 |
| [Phase 4](./phase-4-dashboard.md) | Filament KPI ダッシュボード | 2週間 | 🟡 高 |
| [Phase 5](./phase-5-ai.md) | AI 機能（要約・チャーン予測） | 3週間 | 🟢 中 |

---

## 推奨実施順序

```
Phase 2（LINE基盤）
  └→ Phase 3（シナリオ実行）
        └→ Phase 1（PatientValue精度向上）
              └→ Phase 4（ダッシュボード可視化）
                    └→ Phase 5（AI差別化）
```

Phase 2 → Phase 3 が最優先。`MailScenario` / `StepMailLog` の構造は既に整っており、
実行エンジンを乗せるだけでCRMのコア機能が完成する。

---

## 技術スタック前提

| 層 | 技術 |
|---|---|
| バックエンド | Laravel + Filament |
| 配信チャネル | LINE Messaging API（`LineMessagingService` 実装済み） |
| キュー | Laravel Queue（database driver 推奨） |
| スケジューラ | Laravel Scheduler（`app/Console/Commands`） |
| AI | OpenAI API（GPT-4o-mini） |

---

## ディレクトリ変更サマリー（全フェーズ完了後）

```
app/
├── Console/Commands/
│   └── SendScheduledScenarios.php      # Phase 3 新規
├── Http/Controllers/
│   └── LineWebhookController.php       # Phase 2 新規
├── Jobs/
│   ├── PatientValueCalculateJob.php    # Phase 1 新規
│   ├── ScheduleScenarioJob.php         # Phase 3 新規
│   └── SendLineScenarioJob.php         # Phase 3 新規
├── Observers/
│   └── ReservationObserver.php         # Phase 1 新規
├── Services/
│   ├── LineMessagingService.php        # Phase 2 改修
│   ├── MessageContentService.php       # Phase 3 改修
│   └── NarrativeSyncService.php        # Phase 5 改修
├── Filament/Widgets/
│   ├── ClinicStatsWidget.php           # Phase 4 新規
│   ├── VisitTrendChartWidget.php       # Phase 4 新規
│   ├── DormantPatientWidget.php        # Phase 4 新規
│   └── ScenarioEffectWidget.php        # Phase 4 新規
database/migrations/
│   ├── add_line_uid_to_users.php       # Phase 2 新規
│   └── add_churn_score_to_patient_values.php  # Phase 5 新規
```
