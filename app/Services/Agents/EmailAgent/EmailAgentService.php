<?php

namespace App\Services\Agents\EmailAgent;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmailAgentService
{
  private string $getEmailsWebhookUrl;
  private string $apiKey;

  public function __construct()
  {
    $this->getEmailsWebhookUrl = config('services.email_agent.get_emails_webhook_url');
    $this->apiKey = config('services.email_agent.api_key');
  }

  /**
   * Get Gmail emails via Email Agent webhook
   *
   * @param array $data
   * @return array
   */
  public function getGmail(array $data = []): array
  {
    try {
      // Log the request details for debugging
      Log::info('EmailAgent get Gmail webhook request starting', [
        'url' => $this->getEmailsWebhookUrl,
        'api_key_length' => strlen($this->apiKey),
        'data_keys' => array_keys($data),
        'data' => $data
      ]);

      $response = Http::withHeaders([
        'EMAIL_AGENT_GETEMAILS' => $this->apiKey,
        'Content-Type' => 'application/json',
      ])
        ->timeout(60)
        ->post($this->getEmailsWebhookUrl, $data);

      // Log the raw response for debugging
      Log::info('EmailAgent get Gmail webhook raw response', [
        'status_code' => $response->status(),
        'headers' => $response->headers(),
        'body' => $response->body(),
        'successful' => $response->successful()
      ]);

      if ($response->successful()) {
        // Try to get JSON response, but handle cases where response might be empty or not JSON
        $responseData = null;
        try {
          $responseData = $response->json();
        } catch (\Exception $jsonException) {
          $responseData = $response->body();
          Log::warning('EmailAgent get Gmail webhook response is not valid JSON', [
            'body' => $response->body(),
            'json_error' => $jsonException->getMessage()
          ]);
        }

        Log::info('EmailAgent get Gmail webhook triggered successfully', [
          'status_code' => $response->status(),
          'response' => $responseData
        ]);

        return [
          'success' => true,
          'data' => $responseData,
          'status_code' => $response->status(),
          'message' => 'Gmail emails retrieved successfully'
        ];
      } else {
        Log::error('EmailAgent get Gmail webhook failed', [
          'status_code' => $response->status(),
          'response' => $response->body(),
          'headers' => $response->headers()
        ]);

        return [
          'success' => false,
          'error' => 'Gmail webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body(),
          'message' => 'Failed to retrieve Gmail emails'
        ];
      }
    } catch (\Exception $e) {
      Log::error('EmailAgent get Gmail webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'url' => $this->getEmailsWebhookUrl ?? 'not set',
        'api_key_set' => !empty($this->apiKey)
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'An error occurred while retrieving Gmail emails'
      ];
    }
  }

  /**
   * Get Outlook emails via Email Agent webhook
   *
   * @param array $data
   * @return array
   */
  public function getOutlook(array $data = []): array
  {
    try {
      // Log the request details for debugging
      Log::info('EmailAgent get Outlook webhook request starting', [
        'url' => $this->getEmailsWebhookUrl,
        'api_key_length' => strlen($this->apiKey),
        'data_keys' => array_keys($data),
        'data' => $data
      ]);

      $response = Http::withHeaders([
        'EMAIL_AGENT_GETEMAILS' => $this->apiKey,
        'Content-Type' => 'application/json',
      ])
        ->timeout(60)
        ->post($this->getEmailsWebhookUrl, $data);

      // Log the raw response for debugging
      Log::info('EmailAgent get Outlook webhook raw response', [
        'status_code' => $response->status(),
        'headers' => $response->headers(),
        'body' => $response->body(),
        'successful' => $response->successful()
      ]);

      if ($response->successful()) {
        // Try to get JSON response, but handle cases where response might be empty or not JSON
        $responseData = null;
        try {
          $responseData = $response->json();
        } catch (\Exception $jsonException) {
          $responseData = $response->body();
          Log::warning('EmailAgent get Outlook webhook response is not valid JSON', [
            'body' => $response->body(),
            'json_error' => $jsonException->getMessage()
          ]);
        }

        Log::info('EmailAgent get Outlook webhook triggered successfully', [
          'status_code' => $response->status(),
          'response' => $responseData
        ]);

        return [
          'success' => true,
          'data' => $responseData,
          'status_code' => $response->status(),
          'message' => 'Outlook emails retrieved successfully'
        ];
      } else {
        Log::error('EmailAgent get Outlook webhook failed', [
          'status_code' => $response->status(),
          'response' => $response->body(),
          'headers' => $response->headers()
        ]);

        return [
          'success' => false,
          'error' => 'Outlook webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body(),
          'message' => 'Failed to retrieve Outlook emails'
        ];
      }
    } catch (\Exception $e) {
      Log::error('EmailAgent get Outlook webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'url' => $this->getEmailsWebhookUrl ?? 'not set',
        'api_key_set' => !empty($this->apiKey)
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'An error occurred while retrieving Outlook emails'
      ];
    }
  }
}
