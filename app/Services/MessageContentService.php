<?php

namespace App\Services;

use App\Models\User;

class MessageContentService
{
    /**
     * Terminology:
     * - LINE messages are plain text (or flex messages, but we use text for now).
     * - Constraints: 5000 chars max.
     */

    public function getThankYouText(User $user): string
    {
        $name = $user->name;
        
        return <<<EOT
{$name} 様

昨日はご来院ありがとうございました。
施術後の経過はいかがでしょうか？

もし気になる点やご不明な点がございましたら、
お気軽に当院までご連絡ください。

またのご来院を心よりお待ちしております。

--------------------------
クリニックCRM
Tel: 03-1234-5678
--------------------------
EOT;
    }

    public function getSixMonthReminderText(User $user): string
    {
        $name = $user->name;

        return <<<EOT
{$name} 様

いつも当院をご利用いただきありがとうございます。
前回の施術から半年が経過いたしました。

その後、お変わりありませんでしょうか？
定期的な検診やメンテナンスをお勧めしております。

ご予約はWebまたはお電話にて承っております。
スタッフ一同、{$name}様のご来院をお待ちしております。

--------------------------
クリニックCRM
Tel: 03-1234-5678
Web予約: https://clinic-crm.example.com/login
--------------------------
EOT;
    }
}
