<?php

return [
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'client_id' => env('MIDTRANS_CLIENT_ID'),
    'private_key' => env('MIDTRANS_PRIVATE_KEY'),
    'client_secret' => env('MIDTRANS_CLIENT_SECRET'),
    'partner_id' => env('MIDTRANS_PARTNER_ID'),
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'channel_id' => env('MIDTRANS_CHANNEL_ID'),
    'enable_logging' => env('MIDTRANS_ENABLE_LOGGING', false),
    'public_key' => env('MIDTRANS_PUBLIC_KEY'),
    'notification_url' => env('MIDTRANS_NOTIFICATION_URL'),
];