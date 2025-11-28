<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>お問い合わせがありました</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">お問い合わせがありました</h2>
        <p>以下の内容でお問い合わせを受け付けました。</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <p><strong>お名前:</strong> {{ $data['name'] }}</p>
            <p><strong>会社名:</strong> {{ $data['company_name'] ?? '未入力' }}</p>
            <p><strong>メールアドレス:</strong> {{ $data['email'] }}</p>
            
            <div style="margin-top: 20px; border-top: 1px solid #d1d5db; pt-4">
                <strong>お問い合わせ内容:</strong><br>
                {!! nl2br(e($data['message'])) !!}
            </div>
        </div>

        <p style="margin-top: 30px; font-size: 0.9em; color: #6b7280;">
            ※このメールはシステムからの自動送信です。
        </p>
    </div>
</body>
</html>
