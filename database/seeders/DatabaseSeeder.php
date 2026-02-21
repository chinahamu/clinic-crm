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
     * Phase 3: 在庫              ← 後続フェーズで追加予定
     * Phase 4: オペレーション
     * Phase 5: カルテ            ← 後続フェーズで追加予定
     * Phase 6: マーケティング    ← 後続フェーズで追加予定
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
            ProductSeeder::class,             // [Phase 1 新規] 物販商品 & menu_product 紐付け
            MedicineAndConsumableSeeder::class, // 薬剤・消耗品マスター
            MenuItemSeeder::class,            // メニュー×薬剤/消耗品 紐付け
            DocumentTemplateSeeder::class,    // 同意書テンプレート
            MedicalInterviewTemplateSeeder::class, // [Phase 1 追加登録] 問診テンプレート
            DefaultScenariosSeeder::class,    // [Phase 1 追加登録] ステップメールシナリオ

            // ==========================================================
            // Phase 2: ユーザー・スタッフ（Phase 1 のロール定義に依存）
            // ==========================================================
            StaffSeeder::class,               // スタッフアカウント
            PatientSeeder::class,             // 患者アカウント（50 名 + 固定テスト患者）

            // ==========================================================
            // Phase 3: 在庫（薬剤・消耗品に依存）
            // ==========================================================
            // StockSeeder::class,            // TODO: Phase 2 実装予定

            // ==========================================================
            // Phase 4: オペレーション（スタッフ・患者・メニューに依存）
            // ==========================================================
            ShiftSeeder::class,               // スタッフシフト
            ContractSeeder::class,            // 患者契約
            ReservationSeeder::class,         // 予約
            // ShiftRequestSeeder::class,     // TODO: Phase 2 実装予定
            // StaffConstraintSeeder::class,  // TODO: Phase 2 実装予定
            // ContractUsageSeeder::class,    // TODO: Phase 2 実装予定
            // ReservationItemSeeder::class,  // TODO: Phase 2 実装予定

            // ==========================================================
            // Phase 5 & 6: カルテ・マーケティング（予約・患者に依存）
            // ==========================================================
            // MedicalInterviewResponseSeeder::class, // TODO: Phase 3 実装予定
            // NarrativeSeeder::class,                // TODO: Phase 3 実装予定
            // SignedDocumentSeeder::class,           // TODO: Phase 3 実装予定
            // StepMailLogSeeder::class,              // TODO: Phase 4 実装予定

            // ==========================================================
            // CustomerSegmentSeeder は User・Reservation・Contract の
            // 追加デモデータを独自生成するため最後に実行
            // ==========================================================
            CustomerSegmentSeeder::class,     // [Phase 1 追加登録] セグメント定義 & デモ患者
        ]);
    }
}
