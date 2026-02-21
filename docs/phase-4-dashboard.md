# Phase 4：KPI ダッシュボード（CRM クリニック管理者向け）

**期間**：2週間  
**優先度**：🟡 高  
**依存関係**：Phase 1（PatientValue）、Phase 3（StepMailLog）完了後が理想的

---

## 設計変更（Phase4 着手前に確認済み）

> 当初 docs では Filament Widget を使った実装を想定していたが、  
> **Filament は運営側管理画面として分離されている**ため、  
> クリニック管理者がアクセスする CRM スタッフ画面（**Inertia + React**）に実装する。

---

## アクセスパス

```
GET /staff/kpi-dashboard
認証: auth:staff ミドルウェア（既存スタッフ認証）
```

---

## ダッシュボード全体レイアウト

```
┌─────────────────────────────────────────────────────────────────┐
│ [今月の来院数]  [新規患者数]  [月次売上]  [平均LTV]          │  ← KpiCard × 4
├─────────────────────────────────────────────────────────────────┤
│   来院トレンドグラフ（12ヶ月）（新規/リピート穎み上げ）    │ シナリオ配信効果 │  ← 2:1 グリッド
├─────────────────────────────────────────────────────────────────┤
│  要アクション患者リスト（休眠 60 日以上 · 最大20名）               │  ← DormantPatientTable
└─────────────────────────────────────────────────────────────────┘
```

---

## 実装ファイル

### バックエンド

- **`app/Http/Controllers/Staff/KpiDashboardController.php`**
  - 4種の KPI カード集計（今月 ・ 先月比％）
  - 来院トレンド（過去 12 ヶ月 × 新規/リピート）
  - シナリオ配信効果（sent / skipped / failed）
  - 休眠患者リスト（patientValue.status\_label = dormant、最大20件）

- **`app/Http/Controllers/Staff/PatientScenarioController.php`**
  - `trigger()`: スタッフが手動でシナリオをディスパッチ

- **`routes/web.php`** に追加:
  - `GET  /staff/kpi-dashboard`
  - `POST /staff/patients/{patient}/trigger-scenario`

### フロントエンド

- **`resources/js/Pages/Staff/KpiDashboard.jsx`**
  - `<KpiCard>`: 先月比％付きカード
  - `<VisitTrendChart>`: pure CSS 穎み上げ棒グラフ（外部ライブラリ不要）
  - シナリオ配信効果サイドカード
  - `<DormantPatientTable>`: LINE 送信ボタン付き休眠患者テーブル

> **レイアウトコンポーネントについて**  
> `KpiDashboard.jsx` はコンテンツ部分のみを実装しています。  
> 既存の `Dashboard.jsx` と同様に、スタッフ用コモンレイアウトでラップして使用してください。

---

## 完了判定チェックリスト

- [ ] `GET /staff/kpi-dashboard` が 200 で返る
- [ ] KPI カード4枚が先月比パーセンテージ付きで表示される
- [ ] 来院トレンドグラフが過去 12 ヶ月分を表示する
- [ ] 休眠患者テーブルの「LINE送信」ボタンが line\_id 未設定で無効化される
- [ ] 「LINE送信」クリックで `ScheduleScenarioJob(no\_visit\_60d)` がキューに入る
- [ ] 先月比のパーセンテージが正しく計算される
