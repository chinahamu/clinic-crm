<?php

namespace Database\Seeders;

use App\Models\MailScenario;
use Illuminate\Database\Seeder;

/**
 * 標準シナリオ 3 件を登録するシーダー。
 *
 * 実行方法:
 *   php artisan db:seed --class=DefaultScenariosSeeder
 *
 * テンプレート変数一覧 (MessageContentService参照):
 *   {{\u60a3\u8005\u540d}} {{\u656c\u79f0}} {{\u6765\u9662\u65e5}} {{\u30e1\u30cb\u30e5\u30fc\u540d}} {{\u30af\u30ea\u30cb\u30c3\u30af\u540d}}
 */
class DefaultScenariosSeeder extends Seeder
{
    public function run(): void
    {
        $scenarios = [
            [
                'name'         => '初回来院後フォロー (3日後)',
                'trigger_type' => 'after_first_visit',
                'days_offset'  => 3,
                'subject'      => '先日はご来院ありがとうございました',
                'body'         =>
                    "{{患者名}}{{敬称}}\n\n先日はご来院いただきありがとうございました。\nその後いかがお過ごしでしょうか。\n\nご不明な点やお気になることがございましたら、いつでもご連絡ください。\n\n次回のご来院もお待ちしております。",
                'sender_name'  => '{{クリニック名}}',
                'is_active'    => true,
                'clinic_id'    => null,
            ],
            [
                'name'         => '来院後 1 ヶ月フォロー',
                'trigger_type' => 'after_visit',
                'days_offset'  => 30,
                'subject'      => 'ご来院から1ヶ月が経ちました',
                'body'         =>
                    "{{患者名}}{{敬称}}\n\n{{来院日}}のご来院から1ヶ月が経ちました。\n{{メニュー名}}の効果はいかがでしょうか。\n\n次回のご予約はこちらからどうぞ。",
                'sender_name'  => '{{クリニック名}}',
                'is_active'    => true,
                'clinic_id'    => null,
            ],
            [
                'name'         => '休眠復帰傑入 (60日未来院)',
                'trigger_type' => 'no_visit_60d',
                'days_offset'  => 0,
                'subject'      => 'お久しぶりです',
                'body'         =>
                    "{{患者名}}{{敬称}}\n\nお久しぶりです。{{クリニック名}}です。\nご来院かも60日以上が経ちましたが、その後いかがお過ごしでしょうか。\n\n期間限定のキャンペーンもご用意しております。ぜひご来院ください。",
                'sender_name'  => '{{クリニック名}}',
                'is_active'    => true,
                'clinic_id'    => null,
            ],
        ];

        foreach ($scenarios as $scenario) {
            MailScenario::firstOrCreate(
                [
                    'trigger_type' => $scenario['trigger_type'],
                    'clinic_id'    => $scenario['clinic_id'],
                    'name'         => $scenario['name'],
                ],
                $scenario
            );
        }

        $this->command->info('DefaultScenariosSeeder: ' . count($scenarios) . ' 件のシナリオを登録しました。');
    }
}
