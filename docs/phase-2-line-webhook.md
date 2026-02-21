# Phase 2：LINE Webhook & line_uid バインド

**期間**：2週間  
**優先度**：🔴 最高（Phase 3 の前提条件）  
**依存関係**：なし

---

## 目的

`LineMessagingService::pushMessage()` は `line_uid` を受け取る設計だが、  
**Webhook受信・`line_uid` とUserの紐付けが未実装**。  
このフェーズでPhase 3のシナリオ自動配信が動く基盤を整える。

---

## 実装タスク

### 1. マイグレーション：users テーブルに line_uid 追加

```php
// database/migrations/xxxx_add_line_uid_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->string('line_uid')->nullable()->unique()->after('email')
          ->comment('LINE ユーザーID（Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx）');
});
```

---

### 2. LineWebhookController 新規作成

```php
// app/Http/Controllers/LineWebhookController.php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use LINE\Parser\EventRequestParser;
use LINE\Constants\HTTPHeader;
use LINE\Webhook\Model\FollowEvent;
use LINE\Webhook\Model\TextMessageContent;
use LINE\Webhook\Model\MessageEvent;

class LineWebhookController extends Controller
{
    /**
     * LINE Webhook エンドポイント
     * 署名検証 → イベント処理
     */
    public function handle(Request $request): Response
    {
        $channelSecret = config('services.line.channel_secret');
        $signature     = $request->header(HTTPHeader::LINE_SIGNATURE);
        $body          = $request->getContent();

        try {
            $events = EventRequestParser::parseEventRequest($body, $signature, $channelSecret);
        } catch (\Exception $e) {
            Log::warning('LINE Webhook 署名検証失敗: ' . $e->getMessage());
            return response('Forbidden', 403);
        }

        foreach ($events->getEvents() as $event) {
            match (true) {
                $event instanceof FollowEvent  => $this->handleFollow($event),
                $event instanceof MessageEvent => $this->handleMessage($event),
                default                        => null,
            };
        }

        return response('OK', 200);
    }

    /**
     * フォローイベント：電話番号でユーザー検索して line_uid を保存
     * ※ LINE Official Account Manager でリッチメニューにより
     *    来院時に患者が「友達追加」するフローを前提とする
     */
    private function handleFollow(FollowEvent $event): void
    {
        $lineUserId = $event->getSource()->getUserId();
        Log::info("LINE Follow: {$lineUserId}");
        // NOTE: 電話番号の解決は LINE Login または QR コードフローで実装する。
        // ここでは line_uid だけを一時テーブルに記録し、受付端末での紐付けUIで確定させる。
        \DB::table('line_uid_pending')->insertOrIgnore([
            'line_uid'   => $lineUserId,
            'created_at' => now(),
        ]);
    }

    /**
     * メッセージイベント：「連携」キーワードで line_uid を確定紐付け
     * 患者が受付で発行された 6桁トークンを LINE に送信するフロー
     */
    private function handleMessage(MessageEvent $event): void
    {
        $content = $event->getMessage();
        if (!$content instanceof TextMessageContent) return;

        $text       = trim($content->getText());
        $lineUserId = $event->getSource()->getUserId();

        // 「連携 123456」形式のメッセージを検知
        if (preg_match('/^連携\s+(\d{6})$/', $text, $m)) {
            $this->bindLineUid($lineUserId, $m[1]);
        }
    }

    /**
     * 6桁トークンで User を特定して line_uid を保存
     */
    private function bindLineUid(string $lineUserId, string $token): void
    {
        $pending = \DB::table('line_bind_tokens')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$pending) {
            Log::warning("LINE bind token not found or expired: {$token}");
            return;
        }

        User::where('id', $pending->user_id)
            ->update(['line_uid' => $lineUserId]);

        \DB::table('line_bind_tokens')->where('token', $token)->delete();
        Log::info("LINE UID bound: user_id={$pending->user_id}, line_uid={$lineUserId}");
    }
}
```

---

### 3. トークン発行テーブルのマイグレーション

```php
// database/migrations/xxxx_create_line_bind_tokens_table.php
Schema::create('line_bind_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('token', 6)->unique();
    $table->timestamp('expires_at');
    $table->timestamps();
});

Schema::create('line_uid_pending', function (Blueprint $table) {
    $table->id();
    $table->string('line_uid')->unique();
    $table->timestamps();
});
```

---

### 4. トークン発行サービス

```php
// app/Services/LineBindTokenService.php
<?php

namespace App\Services;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class LineBindTokenService
{
    /**
     * 受付スタッフが患者に渡す6桁トークンを発行
     */
    public function issue(int $userId): string
    {
        // 既存トークンを削除
        DB::table('line_bind_tokens')->where('user_id', $userId)->delete();

        $token = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        DB::table('line_bind_tokens')->insert([
            'user_id'    => $userId,
            'token'      => $token,
            'expires_at' => now()->addMinutes(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $token;
    }
}
```

---

### 5. ルート登録

```php
// routes/web.php
// Webhook は CSRF 除外が必要
Route::post('/webhook/line', [LineWebhookController::class, 'handle'])
     ->name('webhook.line');
```

`app/Http/Middleware/VerifyCsrfToken.php`：

```php
protected $except = [
    'webhook/line',
];
```

---

### 6. .env.example に追記

```dotenv
LINE_CHANNEL_TOKEN=
LINE_CHANNEL_SECRET=
```

`config/services.php`：

```php
'line' => [
    'channel_token'  => env('LINE_CHANNEL_TOKEN'),
    'channel_secret' => env('LINE_CHANNEL_SECRET'),
],
```

---

## LINE 公式側の設定手順

1. LINE Developers Console でチャネルを作成
2. Webhook URL に `https://your-domain.com/webhook/line` を設定
3. 「Webhook の利用」をオン
4. チャネルアクセストークン（長期）・チャネルシークレットを `.env` に記載

---

## 完了判定

- [ ] LINE Webhook に POST すると 200 が返る（署名検証通過）
- [ ] 「連携 123456」メッセージで `users.line_uid` が更新される
- [ ] `line_uid` がある患者に `LineMessagingService::pushMessage()` でメッセージが届く
- [ ] トークンは10分で失効する
