<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'n8n' => [
        'webhook_url' => env('Outlook_Agent_WEBHOOK_URL'),
        'username' => env('N8N_USERNAME'),
        'password' => env('N8N_PASSWORD'),
        'api_key' => env('Outlook_Agent_API'),
    ],

    'azure' => [
        'tenant_id' => env('AZURE_TENANT_ID'),
        'client_id' => env('AZURE_CLIENT_ID'),
        'client_secret' => env('AZURE_CLIENT_SECRET'),
        'scope' => env('AZURE_SCOPE', 'https://graph.microsoft.com/.default'),
    ],

    'report_agent' => [
        'webhook_url' => env('REPORT_AGENT_WEBHOOK_URL'),
        'api_key' => env('REPORT_AGENT_API_KEY'),
    ],

    'report_agent_chat' => [
        'webhook_url' => env('REPORT_AGENT_CHAT_WEBHOOK_URL'),
        'api_key' => env('REPORT_AGENT_CHAT_API_KEY'),
        'jwt_secret' => env('REPORT_AGENT_CHAT_JWT_SECRET'),
    ],

];
