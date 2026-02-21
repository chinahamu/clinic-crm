<?php

namespace App\Services;

use App\Models\User;

class MessageContentService
{
    /**
     * MailScenario.body のテンプレート変数を展開する。
     *
     * 使用可能な変数:
     *   {{\u60a3\u8005\u540d}}        患者の氏名 (name)
     *   {{\u656c\u79f0}}          様 (固定文字列)
     *   {{\u6765\u9662\u65e5}}        最終来院日 (Y年m月d日)
     *   {{\u30e1\u30cb\u30e5\u30fc\u540d}}      面当メニュー名 ($context['menu_name'])
     *   {{\u30af\u30ea\u30cb\u30c3\u30af\u540d}}    クリニック名 ($context['clinic_name'])
     *
     * @param string               $template MailScenario.body の内容
     * @param User                 $user     対象患者
     * @param array<string, mixed> $context  予約コンテキスト（menu_name, clinic_name など）
     */
    public function render(string $template, User $user, array $context = []): string
    {
        $lastVisit = $user->reservations()
            ->where('status', 'visited')
            ->latest('start_time')
            ->first();

        $replacements = [
            '{{患者名}}'    => $user->name ?? 'お客様',
            '{{敬称}}'      => '様',
            '{{来院日}}'    => $lastVisit?->start_time?->format('Y年m月d日') ?? '',
            '{{メニュー名}}'  => $context['menu_name']    ?? '',
            '{{クリニック名}}' => $context['clinic_name'] ?? '',
        ];

        return str_replace(
            array_keys($replacements),
            array_values($replacements),
            $template
        );
    }
}
