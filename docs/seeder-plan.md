# デモ・テスト用シーダー作成計画

> 作成日: 2026-02-22  
> 更新日: 2026-02-22  
> 目的: clinic-crm のデモ環境およびテスト環境で全機能を即時確認できるシードデータを整備する

---

## 実装状況サマリー

`database/seeders/` に **26 ファイル**のシーダーが存在し、全て `DatabaseSeeder.php` に登録済み。  
計画していた全シーダーの作成・登録が完了した状態。

---

## テーブルとシーダーの現状マップ

| テーブル | 対応シーダー | 状態 |
|---|---|---|
| clinics | ClinicSeeder | ✅ 登録済み |
| clinic_schedules / exceptions | ClinicScheduleSeeder | ✅ 登録済み |
| clinic_roles | ClinicRoleSeeder | ✅ 登録済み |
| machines / rooms | MasterDataSeeder | ✅ 登録済み |
| menus | MenuSeeder | ✅ 登録済み |
| products / menu_product | ProductSeeder | ✅ 実装・登録済み |
| medicines / consumables | MedicineAndConsumableSeeder | ✅ 登録済み（stocks 初期生成も兼務） |
| menu_items | MenuItemSeeder | ✅ 登録済み |
| document_templates | DocumentTemplateSeeder | ✅ 登録済み |
| medical_interview_templates | MedicalInterviewTemplateSeeder | ✅ 登録済み |
| mail_scenarios | DefaultScenariosSeeder | ✅ 登録済み |
| staff | StaffSeeder | ✅ 登録済み |
| users（患者） | PatientSeeder | ✅ 登録済み |
| stocks | MedicineAndConsumableSeeder + StockSeeder | ✅ 実装・登録済み |
| shifts | ShiftSeeder | ✅ 拡充・登録済み |
| shift_requests | ShiftRequestSeeder | ✅ 実装・登録済み |
| staff_constraints | StaffConstraintSeeder | ✅ 実装・登録済み |
| contracts | ContractSeeder | ✅ 登録済み |
| reservations | ReservationSeeder | ✅ 拡充・登録済み |
| contract_usages | ContractUsageSeeder | ✅ 実装・登録済み |
| reservation_items | ReservationItemSeeder | ✅ 実装・登録済み |
| medical_interview_responses | MedicalInterviewResponseSeeder | ✅ 実装・登録済み |
| narratives 系 | NarrativeSeeder | ✅ 実装・登録済み |
| signed_documents | SignedDocumentSeeder | ✅ 実装・登録済み |
| step_mail_logs | StepMailLogSeeder | ✅ 実装・登録済み |
| customer_segments | CustomerSegmentSeeder | ✅ 登録済み（最後に実行） |

---

## 実装内容（実行順序順）

### Phase 1 — マスターデータ（依存なし）

既存シーダーに加え、未登録だった `MedicalInterviewTemplateSeeder` / `DefaultScenariosSeeder` を `DatabaseSeeder.php` に追加登録。  
`CustomerSegmentSeeder` は独自デモデータを生成するため Phase 1 から切り離し、最後に実行する構成に変更。

#### `ProductSeeder`（実装済み）

- 物販商品を作成（美容液、サプリメント等）
- `menu_product` 中間テーブルも合わせてシード

#### `MedicineAndConsumableSeeder`（拡充済み）

- 薬剤・消耗品マスターの生成に加え、`stocks` テーブルへの初期レコードも同時生成

---

### Phase 2 — ユーザー・スタッフ

既存の `StaffSeeder`・`PatientSeeder` をそのまま維持（50 名 + 固定テスト患者）。

---

### Phase 3 — 在庫

#### `StockSeeder`（実装済み）

- `MedicineAndConsumableSeeder` が生成した stocks レコードに `clinic_id` を付与
- 在庫アラートのデモ用に閾値以下の在庫を数件意図的に含める

---

### Phase 4 — 業務オペレーション

#### `ReservationSeeder`（拡充済み）

ステータスバリエーション（確率配分）:

```php
'confirmed' : 60%  // 確定済み（未来日中心）
'completed' : 30%  // 施術完了（過去日）
'cancelled' :  5%  // キャンセル
'no_show'   :  5%  // 無断キャンセル（LTV 計算デモ用）
```

#### `ReservationItemSeeder`（実装済み）

- `completed` ステータスの予約に紐付けて使用薬剤・消耗品を 1〜3 件挿入

#### `ShiftSeeder`（拡充済み）

- 過去 2 ヶ月〜未来 1 ヶ月分のシフト（月〜土）を各スタッフに対して生成

#### `ShiftRequestSeeder`（実装済み）

```php
// 各スタッフが来月の希望シフトを提出済みという想定
// status: 'pending' / 'approved' / 'rejected'
```

#### `StaffConstraintSeeder`（実装済み）

```php
// スタッフごとに週の勤務上限・特定曜日 NG 等を 1〜2 件
// constraint_type: 'max_hours' / 'day_off_request'
```

#### `ContractUsageSeeder`（実装済み）

```php
// completed 予約に対し contract_usage を 1 件紐付け
// used_at = 予約の start_time
```

---

### Phase 5 — カルテ・問診・同意書

#### `MedicalInterviewResponseSeeder`（実装済み）

- 初回来院の患者（初回予約）に対し問診票回答を生成
- `MedicalInterviewTemplateSeeder` で作成したテンプレートを使用
- `response_data`: JSON フォーマットでサンプル回答を格納

#### `NarrativeSeeder`（実装済み）

```php
// completed の予約ごとに施術記録を 1 件作成
// narrative_type: 'treatment' / 'consultation'
// 担当スタッフ ID を紐付け
// content 例: 「脱毛施術実施。特記事項なし。」
```

#### `SignedDocumentSeeder`（実装済み）

```php
// 各患者の初回契約時に同意書署名済みデータを生成
// document_template_id: DocumentTemplateSeeder で作成した同意書テンプレート
// signed_at: 初回予約日 - 1 日（カウンセリング当日想定）
```

---

### Phase 6 — マーケティング

#### `StepMailLogSeeder`（実装済み）

```php
// 3 シナリオのステップメールログを生成
// DefaultScenariosSeeder で作成したシナリオを使用
// channel: 'email' / 'line'（users テーブルの LINE 連携状況に応じて）
// status: 'sent' / 'pending' / 'skipped'
// 送信タイミング: 初回予約日 +1 日, +7 日, +30 日
```

---

### Phase 7（最後）— 独立デモデータ

`CustomerSegmentSeeder` は User / Reservation / Contract の追加デモデータを独自生成するため、全フェーズ完了後に実行。

---

## `DatabaseSeeder.php` 実行順序（実装済み）

```php
$this->call([
    // Phase 1: マスターデータ
    ClinicSeeder::class,
    ClinicScheduleSeeder::class,
    ClinicRoleSeeder::class,
    MasterDataSeeder::class,
    MenuSeeder::class,
    ProductSeeder::class,
    MedicineAndConsumableSeeder::class,        // stocks も同時生成
    MenuItemSeeder::class,
    DocumentTemplateSeeder::class,
    MedicalInterviewTemplateSeeder::class,
    DefaultScenariosSeeder::class,

    // Phase 2: ユーザー・スタッフ
    StaffSeeder::class,
    PatientSeeder::class,

    // Phase 3: 在庫
    StockSeeder::class,                        // clinic_id 付与 + アラートシナリオ設定

    // Phase 4: オペレーション
    ShiftSeeder::class,
    ShiftRequestSeeder::class,
    StaffConstraintSeeder::class,
    ContractSeeder::class,
    ReservationSeeder::class,
    ContractUsageSeeder::class,
    ReservationItemSeeder::class,

    // Phase 5: カルテ・問診・同意書
    MedicalInterviewResponseSeeder::class,
    NarrativeSeeder::class,
    SignedDocumentSeeder::class,

    // Phase 6: マーケティング
    StepMailLogSeeder::class,

    // Phase 7: 独立デモデータ（最後に実行）
    CustomerSegmentSeeder::class,
]);
```

---

## デモシナリオとして確認可能なデータ状態

全シーダー実行後、以下のシナリオがデモ可能。

| シナリオ | 関係するシーダー |
|---|---|
| 新患来院フロー（問診 → 予約 → 施術 → カルテ → ステップメール） | MedicalInterviewResponseSeeder, ReservationSeeder, NarrativeSeeder, StepMailLogSeeder |
| 回数券契約管理（契約 → 施術消化 → 残回数アラート） | ContractSeeder, ContractUsageSeeder, ReservationSeeder |
| 在庫管理アラート（閾値以下の薬剤・消耗品を即確認） | MedicineAndConsumableSeeder, StockSeeder |
| LTV ダッシュボード（patient_values テーブルの集計検証） | ContractUsageSeeder, ReservationSeeder |
| スタッフシフト（申請 → 承認 → 確定シフト表示） | ShiftSeeder, ShiftRequestSeeder, StaffConstraintSeeder |
| 同意書署名フロー（初回カウンセリング署名履歴確認） | SignedDocumentSeeder, DocumentTemplateSeeder |
| 物販・商品管理（メニューへの商品紐付け確認） | ProductSeeder, ReservationItemSeeder |
| ステップメール配信フロー（LINE / メール 選択） | DefaultScenariosSeeder, StepMailLogSeeder |
