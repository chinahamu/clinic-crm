<?php

namespace App\Services;

use LINE\Clients\MessagingApi\Model\TextMessage;
use LINE\Clients\MessagingApi\Api\MessagingApiApi;
use LINE\Constants\HTTPHeader;
use GuzzleHttp\Client;
use LINE\Parser\EventRequestParser;
use Illuminate\Support\Facades\Log;

class LineMessagingService
{
    protected $client;
    protected $channelToken;

    public function __construct()
    {
        $this->channelToken = config('services.line.channel_token');
        
        $config = new \LINE\Clients\MessagingApi\Configuration();
        $config->setAccessToken($this->channelToken);
        
        $this->client = new MessagingApiApi(
            new Client(),
            $config
        );
    }

    public function sendReservationConfirmation($lineUserId, $reservation)
    {
        if (empty($lineUserId)) {
            Log::warning('LINE User ID is empty. Cannot send reservation confirmation.');
            return false;
        }

        $startDate = $reservation->start_time->format('Y年m月d日 H:i');
        $clinicName = $reservation->clinic->name;
        $menuName = $reservation->menu->name;
        
        $messageText = "ご予約ありがとうございます。\n\n以下の内容で承りました。\n\n■日時\n{$startDate}\n\n■クリニック\n{$clinicName}\n\n■メニュー\n{$menuName}\n\nご来院をお待ちしております。";

        $message = new TextMessage(['text' => $messageText, 'type' => 'text']);

        try {
            $request = new \LINE\Clients\MessagingApi\Model\PushMessageRequest([
                'to' => $lineUserId,
                'messages' => [$message],
            ]);
            
            $this->client->pushMessage($request);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send LINE message: ' . $e->getMessage());
            return false;
        }
    }
}
