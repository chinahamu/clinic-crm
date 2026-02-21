<?php

namespace App\Http\Controllers;

use App\Services\LineBindTokenService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use LINE\Parser\EventRequestParser;
use LINE\Webhook\Model\FollowEvent;
use LINE\Webhook\Model\MessageEvent;
use LINE\Webhook\Model\TextMessageContent;
use App\Models\User;

class LineWebhookController extends Controller
{
    public function __construct(
        private readonly LineBindTokenService $tokenService
    ) {}

    /**
     * LINE Messaging API Webhook エンドポイント
     *
     * 処理フロー:
     *   1. HMAC-SHA256 署名検証 → 失敗時は 403
     *   2. イベントパース
     *   3. FollowEvent  : line_id 紐付け確認・ログ
     *   4. MessageEvent : 「連携 XXXXXX」形式で line_id をバインド
     */
    public function handle(Request $request): Response
    {
        $channelSecret = config('services.line.channel_secret');
        $signature     = $request->header('X-Line-Signature', '');
        $body          = $request->getContent();

        if (!$this->verifySignature($body, $signature, $channelSecret)) {
            Log::warning('LINE Webhook: 署名検証失敗', [
                'ip'        => $request->ip(),
                'signature' => substr($signature, 0, 16) . '...',
            ]);
            return response('Forbidden', 403);
        }

        try {
            $result = EventRequestParser::parseEventRequest($body, $channelSecret, $signature);
            $events = $result->getEvents();
        } catch (\Throwable $e) {
            Log::error('LINE Webhook: イベントパース失敗 — ' . $e->getMessage());
            return response('Bad Request', 400);
        }

        foreach ($events as $event) {
            try {
                match (true) {
                    $event instanceof FollowEvent  => $this->handleFollow($event),
                    $event instanceof MessageEvent => $this->handleMessage($event),
                    default                        => null,
                };
            } catch (\Throwable $e) {
                Log::error('LINE Webhook: イベント処理エラー — ' . $e->getMessage(), [
                    'event_type' => get_class($event),
                ]);
            }
        }

        return response('OK', 200);
    }

    // ------------------------------------------------------------------
    // Private: Event Handlers
    // ------------------------------------------------------------------

    /**
     * フォローイベント
     *
     * - LINE Login 済みの患者 → ログのみ
     * - 未紐付けの場合 → 受付スタッフにトークン発行を依頼するログを残す
     */
    private function handleFollow(FollowEvent $event): void
    {
        $lineUserId = $event->getSource()->getUserId();
        $user       = User::where('line_id', $lineUserId)->first();

        if ($user) {
            Log::info('LINE Follow: 已結合済みユーザー', [
                'user_id' => $user->id,
                'line_id' => $lineUserId,
            ]);
        } else {
            Log::info('LINE Follow: 未結合ユーザー — 受付スタッフがトークンを発行し連携させてください', [
                'line_id' => $lineUserId,
            ]);
        }
    }

    /**
     * テキストメッセージイベント
     *
     * 「連携 123456」形式のメッセージを受信したら line_id をバインドする。
     */
    private function handleMessage(MessageEvent $event): void
    {
        $content = $event->getMessage();
        if (!$content instanceof TextMessageContent) {
            return;
        }

        $text       = trim($content->getText());
        $lineUserId = $event->getSource()->getUserId();

        if (!preg_match('/^連携\s+(\d{6})$/', $text, $m)) {
            return;
        }

        $success = $this->tokenService->bind($lineUserId, $m[1]);

        Log::info(
            $success
                ? "LINE バインド成功: line_id={$lineUserId}"
                : "LINE バインド失敗（トークン無効/期限切れ）: line_id={$lineUserId}, token={$m[1]}"
        );
    }

    // ------------------------------------------------------------------
    // Private: Helpers
    // ------------------------------------------------------------------

    /**
     * LINE 署名を HMAC-SHA256 で検証する。
     *
     * 設計方針: SDK の parseEventRequest も内部で同様の検証を行うが、
     * 事前チェックにより不必要なイベントパースコストを削減する。
     */
    private function verifySignature(string $body, string $signature, string $channelSecret): bool
    {
        if (empty($signature) || empty($channelSecret)) {
            return false;
        }

        $expected = base64_encode(hash_hmac('sha256', $body, $channelSecret, true));
        return hash_equals($expected, $signature);
    }
}
