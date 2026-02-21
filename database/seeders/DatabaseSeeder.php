<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * デモ・テスト用シーダーの実行順序
     *
     * Phase 1: マスターデータ（依存なし）
     * Phase 2: ユーザー・スタッフ
     * Phase 3: 在庫
     * Phase 4: オペレーション
     * Phase 5: カルテ・問診・同意書（今回実装）
     * Phase 6: マーケティング（今回実装）
     *
     * @see docs/seeder-plan.md
     */
    public function run(): void
    {
        $this->call([
            // ==========================================================
            // Phase 1: マスターデータ（依存なし）
            // ==========================================================
            ClinicSeeder::class,              // クリニック基本情報
            ClinicScheduleSeeder::class,      // 営業スケジュール・休診例外
            ClinicRoleSeeder::class,          // クリニック内ロール定義
            MasterDataSeeder::class,          // 部屋・機器マスター
            MenuSeeder::class,                // 施術メニュー
            ProductSeeder::class,             // 物販商品 & menu_product 紐付け
            MedicineAndConsumableSeeder::class, // 薬剤・消耗品マスター（stocks も同時作成）
            MenuItemSeeder::class,            // メニュー × 薬剤/消耗品 紐付け
            DocumentTemplateSeeder::class,    // 同意書テンプレート
            MedicalInterviewTemplateSeeder::class, // 問診テンプレート
            DefaultScenariosSeeder::class,    // ステップメールシナリオ

            // ==========================================================
            // Phase 2: ユーザー・スタッフ（Phase 1 のロール定義に依存）
            // ==========================================================
            StaffSeeder::class,               // スタッフアカウント
            PatientSeeder::class,             // 患者アカウント（50 名 + 固定テスト患者）

            // ==========================================================
            // Phase 3: 在庫（MedicineAndConsumableSeeder の stocks 生成後に実行）
            // ==========================================================
            StockSeeder::class,               // clinic_id 付与 + アラートシナリオ設定

            // ==========================================================
            // Phase 4: オペレーション（スタッフ・患者・メニューに依存）
            // ==========================================================
            ShiftSeeder::class,               // 過去 2ヶ月 + 未来 1ヶ月分のシフト
            ShiftRequestSeeder::class,        // 翌月分シフト希望
            StaffConstraintSeeder::class,     // スタッフ勤務制約
            ContractSeeder::class,            // 患者契約（回数券）
            ReservationSeeder::class,         // 予約（confirmed 60%/completed 30%/cancelled 5%/no_show 5%）
            ContractUsageSeeder::class,       // completed 予約 → contract_usages 紐付け
            ReservationItemSeeder::class,     // completed 予約 → 使用薬剤/消耗品記録

            // ==========================================================
            // Phase 5: カルテ・問診・同意書（予約・患者・テンプレートに依存）
            // ==========================================================
            MedicalInterviewResponseSeeder::class, // 初回予約毎に問診票回答を付与
            NarrativeSeeder::class,                // 施術記録 / 患者属性 / ライフイベント
            SignedDocumentSeeder::class,           // 初回カウンセリング日の同意書署名

            // ==========================================================
            // Phase 6: マーケティング（予約・患者・シナリオに依存）
            // ==========================================================
            StepMailLogSeeder::class,              // 3 シナリオのステップメールログ

            // ==========================================================
            // CustomerSegmentSeeder: User/Reservation/Contract の
            // 追加デモデータを独自生成するため最後に実行
            // ==========================================================
            CustomerSegmentSeeder::class,          // セグメント定義 & デモ患者生成
        ]);
    }
}
