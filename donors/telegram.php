<?php
function sendTelegram($message) {
    $botToken = "";
    $chatId   = "";

    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    file_get_contents($url . "?" . http_build_query([
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ]));
}
