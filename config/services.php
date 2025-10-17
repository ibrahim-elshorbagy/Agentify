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

  // Start Email Agent + QNA

  // Email Agent
  'email_agent' => [
    'get_emails_webhook_url' => env('EMAIL_AGENT_GETEMAILS_WEBHOOK_URL'),
    'api_key' => env('EMAIL_AGENT_GETEMAILS'),
  ],

  // QNA
  'qna_agent_chat' => [
    'webhook_url' => env('QNA_AGENT_CHAT_WEBHOOK_URL'),
    'jwt_secret' => env('QNA_AGENT_CHAT_JWT_SECRET'),
  ],
  // End Email Agent + QNA

  //Start Report Agent
  'report_agent' => [
    'webhook_url' => env('REPORT_AGENT_WEBHOOK_URL'),
    'api_key' => env('REPORTS_AGENT_UPLOADFILES'),
  ],

  'report_agent_chat' => [
    'webhook_url' => env('REPORT_AGENT_CHAT_WEBHOOK_URL'),
    'jwt_secret' => env('REPORTS_AGENT_CHAT'),
  ],


  //End Report Agent

  //Start Hr_agent

  'hr_agent' => [
    'upload_file_url' => env('HR_AGENT_UPLOAD_FILE_URL'),
    'get_gmail_url' => env('HR_AGENT_GET_GMAIL_URL'),
    'get_outlook_url' => env('HR_AGENT_GET_OUTLOOK_URL'),
    'api_key' => env('HR_AGENT_CVINTAKE'),
    'password' => env('HR_AGENT_CVINTAKE'),
  ],

  //End Hr_agent

  //Start OAuth Providers for Email Connections
  'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
  ],

  'microsoft' => [
    'client_id' => env('MICROSOFT_CLIENT_ID'),
    'client_secret' => env('MICROSOFT_CLIENT_SECRET'),
    'redirect' => env('MICROSOFT_REDIRECT_URI'),
    'tenant' => env('MICROSOFT_TENANT_ID', 'common'),
  ],
  //End OAuth Providers for Email Connections

];
