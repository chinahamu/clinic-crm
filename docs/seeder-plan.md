# デモ・テスト用シーダー作成計画

> 作成日: 2026-02-22  
> 目的: clinic-crm のデモ環境およびテスト環境で全機能を即時確認できるシードデータを整備する

---

## 現状分析

`database/seeders/` に 14 ファイルのシーダーが存在するが、`DatabaseSeeder.php` に登録済みは 13 個。  
一部テーブルにはシーダーが未作成・未登録の状態。

---

## テーブルとシーダーの現状マップ

| テーブル | 対応シーダー | 状態 |
|---|---|---|
| clinics | ClinicSeeder | ✅ 登録済み |
| clinic_schedules / exceptions | ClinicScheduleSeeder | ✅ 登録済み |
| staff | StaffSeeder | ✅ 登録済み |
| users（患者） | PatientSeeder | ✅ 登録済み |
| menus / menu_items | MenuSeeder, MenuItemSeeder | ✅ 登録済み |
| machines / rooms | MasterDataSeeder | ✅ 登録済み |
| medicines / consumables | MedicineAndConsumableSeeder | ✅ 登録済み |
| contracts | ContractSeeder | ✅ 登録済み |
| reservations | ReservationSeeder | ✅ 登録済み（要拡充） |
| shifts | ShiftSeeder | ✅ 登録済み（要拡充） |
| document_templates | DocumentTemplateSeeder | ✅ 登録済み |
| medical_interview_templates | MedicalInterviewTemplateSeeder | ⚠️ **未登録** |
| mail_scenarios | DefaultScenariosSeeder | ⚠️ **未登録** |
| customer_segments | CustomerSegmentSeeder | ⚠️ **未登録** |
| products / menu_product | — | ❌ シーダー未作成 |
| stocks | — | ❌ シーダー未作成 |
| reservation_items | — | ❌ シーダー未作成 |
| contract_usages | — | ❌ シーダー未作成 |
| shift_requests | — | ❌ シーダー未作成 |
| staff_constraints | — | ❌ シーダー未作成 |
| narratives 系 | — | ❌ シーダー未作成 |
| medical_interview_responses | — | ❌ シーダー未作成 |
| signed_documents | — | ❌ シーダー未作成 |
| step_mail_logs | — | ❌ シーダー未作成 |

---

## データ作成計画（実行順）

### Phase 1 — マスターデータ（依存なし）

既存シーダーはそのまま維持。3 つの未登録シーダーを `DatabaseSeeder.php` に追加登録する。

```php
// DatabaseSeeder.php に追記
MedicalInterviewTemplateSeeder::class,  // 未登録のため追加
DefaultScenariosSeeder::class,          // 未登録のため追加
CustomerSegmentSeeder::class,           // 未登録のため追加
```

#### 新規: `ProductSeeder`

- 物販商品を 5〜10 件作成（例：美容液、サプリメント）
- `menu_product` 中間テーブルも合わせてシード（各メニューに 1〜3 商品を紐付け）

---

### Phase 2 — 在庫データ

#### 新規: `StockSeeder`

```php
// 薬剤・消耗品ごとに stocks レコードを 1 件作成
// current_quantity: 薬剤は 10〜100、消耗品は 20〜200
// alert_threshold: 薬剤 5、消耗品 10
// ※在庫アラートのデモ用に閾値以下の在庫も数件意図的に含める
```

---

### Phase 3 — 業務オペレーションデータ

#### 既存 `ReservationSeeder` の拡充

現在は `rand(-30, 30)` 日の範囲で予約を作成している。  
デモ用途では以下のステータスバリエーションを追加する。

```php
// status バリエーション（概率配分）
'confirmed' : 60%  // 確定済み（未来日中心）
'completed' : 30%  // 施術完了（過去日のもの）
'cancelled' :  5%  // キャンセル
'no_show'   :  5%  // 無断キャンセル（LTV 計算デモ用）
```

#### 新規: `ReservationItemSeeder`

- `completed` ステータスの予約に紐付けて `reservation_items` を作成
- menu_item（薬剤・消耗品の使用記録）を 1〜3 件ずつ挿入

#### 既存 `ShiftSeeder` の拡充

過去 2 ヶ月〜未来 1 ヶ月分のシフト（月〜土）を各スタッフに対して生成。

#### 新規: `ShiftRequestSeeder`

```php
// 各スタッフが来月の希望シフトを提出済みという想定
// status: 'pending' / 'approved' / 'rejected'
```

#### 新規: `StaffConstraintSeeder`

```php
// スタッフごとに週の勤務上限・特定曜日 NG 等を 1〜2 件
// constraint_type: 'max_hours' / 'day_off_request'
```

---

### Phase 4 — 契約・サービス利用データ

#### 既存 `ContractSeeder` の拡充確認

`contract_details` テーブル（マイグレーション: `2025_12_27_072121`）に未対応の場合は `contract_details` レコードを追加生成する。

#### 新規: `ContractUsageSeeder`

```php
// 回数券形式の契約について使用履歴を生成
// 各 completed 予約に対し contract_usage を 1 件紐付け
// used_at = 予約の start_time
```

---

### Phase 5 — カルテ・問診データ

#### 新規: `MedicalInterviewResponseSeeder`

```php
// 初回来院の患者（初回予約）に対し問診票回答を作成
// MedicalInterviewTemplateSeeder で作成したテンプレートを使用
// response_data: JSON フォーマットでサンプル回答を格納
```

#### 新規: `NarrativeSeeder`（カルテ記録）

```php
// completed の予約ごとに施術記録を 1 件作成
// narrative_type: 'treatment' / 'consultation'
// 担当スタッフ ID を紐付け
// content サンプル例: 「脱毛施術実施。特記事項なし。」
```

#### 新規: `SignedDocumentSeeder`

```php
// 各患者の初回契約時に同意書署名済みデータを作成
// document_template_id: DocumentTemplateSeeder で作成した同意書テンプレート
// signed_at: 初回予約日 - 1 日（カウンセリング当日想定）
```

---

### Phase 6 — マーケティングデータ

#### 新規: `StepMailLogSeeder`

```php
// 新規患者（初来院後）に対してステップメール送信ログを作成
// DefaultScenariosSeeder で作成したシナリオを使用
// channel: 'email' / 'line'（users テーブルの LINE 連携状況に応じて）
// status: 'sent' / 'pending' / 'skipped'
// 送信タイミング: 初回予約日 +1 日, +7 日, +30 日
```

---

## `DatabaseSeeder.php` の最終実行順序

```php
$this->call([
    // Phase 1: マスターデータ
    ClinicSeeder::class,
    ClinicScheduleSeeder::class,
    ClinicRoleSeeder::class,
    MasterDataSeeder::class,
    MenuSeeder::class,
    ProductSeeder::class,                       // 新規
    MedicineAndConsumableSeeder::class,
    MenuItemSeeder::class,
    DocumentTemplateSeeder::class,
    MedicalInterviewTemplateSeeder::class,      // 追加登録
    DefaultScenariosSeeder::class,              // 追加登録
    CustomerSegmentSeeder::class,               // 追加登録

    // Phase 2: ユーザー・スタッフ
    StaffSeeder::class,
    PatientSeeder::class,

    // Phase 3: 在庫
    StockSeeder::class,                         // 新規

    // Phase 4: オペレーション
    ShiftSeeder::class,
    ShiftRequestSeeder::class,                  // 新規
    StaffConstraintSeeder::class,               // 新規
    ContractSeeder::class,
    ContractUsageSeeder::class,                 // 新規
    ReservationSeeder::class,
    ReservationItemSeeder::class,               // 新規

    // Phase 5: カルテ
    MedicalInterviewResponseSeeder::class,      // 新規
    NarrativeSeeder::class,                     // 新規
    SignedDocumentSeeder::class,                // 新規

    // Phase 6: マーケティング
    StepMailLogSeeder::class,                   // 新規
]);
```

---

## デモシナリオとして想定するデータ状態

計画を全実行すると、以下のシナリオがデモ可能になる。

| シナリオ | 関係するシーダー |
|---|---|
| 新患来院フロー（問診 → 予約 → 施術 → カルテ → ステップメール） | MedicalInterviewResponseSeeder, ReservationSeeder, NarrativeSeeder, StepMailLogSeeder |
| 回数券契約管理（契約 → 施術消化 → 残回数アラート） | ContractSeeder, ContractUsageSeeder, ReservationSeeder |
| 在庫管理アラート（閾値以下の薬剤・消耗品を即確認） | StockSeeder, MedicineAndConsumableSeeder |
| LTV ダッシュボード（patient_values テーブルの集計検証） | ContractUsageSeeder, ReservationSeeder |
| スタッフシフト（申請 → 承認 → 確定シフト表示） | ShiftSeeder, ShiftRequestSeeder, StaffConstraintSeeder |
| 同意書署名フロー（初回カウンセリング署名履歴確認） | SignedDocumentSeeder, DocumentTemplateSeeder |
