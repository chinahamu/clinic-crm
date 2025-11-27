<!DOCTYPE html>
<html>
<head>
    <title>ご予約ありがとうございます</title>
</head>
<body>
    <h1>{{ $reservation->user->name }} 様</h1>
    <p>以下の内容でご予約を承りました。</p>

    <ul>
        <li><strong>日時:</strong> {{ $reservation->start_time->format('Y年m月d日 H:i') }}</li>
        <li><strong>メニュー:</strong> {{ $reservation->menu->name }}</li>
        <li><strong>クリニック:</strong> {{ $reservation->clinic->name }}</li>
    </ul>

    <p>ご来院をお待ちしております。</p>
</body>
</html>
