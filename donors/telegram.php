<?php
function sendTelegram($message) {
    $botToken = "8419132293:AAGMFVCgIKzbRDM-_BonZDfVv4-p_LCtAy0";
    $chatId   = "-1003585973606";

    $url = "https://api.telegram.org/bot{$botToken}/sendMessage";
    file_get_contents($url . "?" . http_build_query([
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ]));
}
