<!DOCTYPE html>
<html>
<head>
    <title>新規予約が入りました</title>
</head>
<body>
    <h1>新規予約通知</h1>
    <p>新しい予約が入りました。</p>

    <ul>
        <li><strong>患者名:</strong> {{ $reservation->user->name }}</li>
        <li><strong>日時:</strong> {{ $reservation->start_time->format('Y年m月d日 H:i') }}</li>
        <li><strong>メニュー:</strong> {{ $reservation->menu->name }}</li>
        <li><strong>クリニック:</strong> {{ $reservation->clinic->name }}</li>
    </ul>

    <p>管理画面で詳細をご確認ください。</p>
</body>
</html>
