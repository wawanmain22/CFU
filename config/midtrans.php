<?php

return [
    // General Settings
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'enable_logging' => env('MIDTRANS_ENABLE_LOGGING', false),

    // Merchant Credentials
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'service_id' => env('MIDTRANS_SERVICE_ID', '70012'),

    // API Keys & Secrets
    'client_key' => env('VITE_MIDTRANS_CLIENT_KEY'),
    'server_key' => env('MIDTRANS_PRIVATE_KEY'),
    'client_id' => env('MIDTRANS_CLIENT_ID', 'g1SaAz1Z-G805920087-SNAP'),
    'client_secret' => env('MIDTRANS_CLIENT_SECRET'),
    'public_key' => env('MIDTRANS_PUBLIC_KEY'),

    // Partner Information
    'partner_id' => env('MIDTRANS_PARTNER_ID'),
    'channel_id' => env('MIDTRANS_CHANNEL_ID'),

    // Notification Settings
    'notification_url' => env('MIDTRANS_NOTIFICATION_URL'),
];