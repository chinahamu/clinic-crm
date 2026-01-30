<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>定期検診のご案内</title>
</head>
<body>
    <p>{{ $user->name }} 様</p>

    <p>いつも当クリニックをご利用いただきありがとうございます。<br>
    前回の施術から半年が経過しました。</p>

    <p>その後、お肌の調子はいかがでしょうか？<br>
    そろそろメンテナンスの時期として、定期的な検診や施術をおすすめしております。</p>

    <p>Web予約は以下のリンクから可能です。</p>
    <p><a href="{{ config('app.url') }}/login">予約ページへ移動</a></p>

    <p>{{ $user->name }}様のご来院をお待ちしております。</p>

    <hr>
    <p>クリニックCRM<br>
    Website: {{ config('app.url') }}</p>
</body>
</html>
