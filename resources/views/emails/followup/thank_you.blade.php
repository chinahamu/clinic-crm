<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ご来院ありがとうございます</title>
</head>
<body>
    <p>{{ $user->name }} 様</p>

    <p>昨日は当クリニックにご来院いただき、誠にありがとうございました。<br>
    施術後の経過はいかがでしょうか？</p>

    <p>何か気になる点やご不明な点がございましたら、お気軽にご連絡ください。</p>

    <p>またのご来院を心よりお待ち申し上げております。</p>

    <hr>
    <p>クリニックCRM<br>
    Website: {{ config('app.url') }}</p>
</body>
</html>
