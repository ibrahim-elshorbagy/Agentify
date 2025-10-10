<?php

namespace App\Services\Agents\HrAgent;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HrAgentService
{
  private string $uploadFileUrl;
  private string $getGmailUrl;
  private string $getOutlookUrl;
  private string $apiKey;
  private string $password;

  public function __construct()
  {
    $this->uploadFileUrl = config('services.hr_agent.upload_file_url');
    $this->getGmailUrl = config('services.hr_agent.get_gmail_url');
    $this->getOutlookUrl = config('services.hr_agent.get_outlook_url');
    $this->apiKey = config('services.hr_agent.api_key');
    $this->password = config('services.hr_agent.password');
  }

  /**
   * Upload file to HR Agent webhook
   *
   * @param array $data
   * @return array
   */
  public function uploadFile(array $data = []): array
  {
    try {
      // Log the request details for debugging
      Log::info('HrAgent upload file webhook request starting', [
        'url' => $this->uploadFileUrl,
        'api_key_length' => strlen($this->apiKey),
        'data_keys' => array_keys($data),
        'data' => $data
      ]);

      $response = Http::withHeaders([
        'HR_AGENT_CVINTAKE' => $this->password,
        'Content-Type' => 'application/json',
      ])
        ->timeout(60)
        ->post($this->uploadFileUrl, $data);

      // Log the raw response for debugging
      Log::info('HrAgent upload file webhook raw response', [
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
          Log::warning('HrAgent upload file webhook response is not valid JSON', [
            'body' => $response->body(),
            'json_error' => $jsonException->getMessage()
          ]);
        }

        Log::info('HrAgent upload file webhook triggered successfully', [
          'status_code' => $response->status(),
          'response' => $responseData
        ]);

        return [
          'success' => true,
          'data' => $responseData,
          'status_code' => $response->status()
        ];
      } else {
        Log::error('HrAgent upload file webhook failed', [
          'status_code' => $response->status(),
          'response' => $response->body(),
          'headers' => $response->headers()
        ]);

        return [
          'success' => false,
          'error' => 'Webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body()
        ];
      }
    } catch (\Exception $e) {
      Log::error('HrAgent upload file webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'url' => $this->uploadFileUrl ?? 'not set',
        'api_key_set' => !empty($this->apiKey)
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage()
      ];
    }
  }

  /**
   * Get Gmail emails via HR Agent webhook
   *
   * @param array $data
   * @return array
   */
  public function getGmail(array $data = []): array
  {
    try {
      // Log the request details for debugging
      Log::info('HrAgent get Gmail webhook request starting', [
        'url' => $this->getGmailUrl,
        'api_key_length' => strlen($this->apiKey),
        'data_keys' => array_keys($data),
        'data' => $data
      ]);

      $response = Http::withHeaders([
        'HR_AGENT_CVINTAKE' => $this->password,
        'Content-Type' => 'application/json',
      ])
        ->timeout(60)
        ->post($this->getGmailUrl, $data);

      // Log the raw response for debugging
      Log::info('HrAgent get Gmail webhook raw response', [
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
          Log::warning('HrAgent get Gmail webhook response is not valid JSON', [
            'body' => $response->body(),
            'json_error' => $jsonException->getMessage()
          ]);
        }

        Log::info('HrAgent get Gmail webhook triggered successfully', [
          'status_code' => $response->status(),
          'response' => $responseData
        ]);

        return [
          'success' => true,
          'data' => $responseData,
          'status_code' => $response->status()
        ];
      } else {
        Log::error('HrAgent get Gmail webhook failed', [
          'status_code' => $response->status(),
          'response' => $response->body(),
          'headers' => $response->headers()
        ]);

        return [
          'success' => false,
          'error' => 'Webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body()
        ];
      }
    } catch (\Exception $e) {
      Log::error('HrAgent get Gmail webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'url' => $this->getGmailUrl ?? 'not set',
        'api_key_set' => !empty($this->apiKey)
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage()
      ];
    }
  }

  /**
   * Get Outlook emails via HR Agent webhook
   *
   * @param array $data
   * @return array
   */
  public function getOutlook(array $data = []): array
  {
    try {
      // Log the request details for debugging
      Log::info('HrAgent get Outlook webhook request starting', [
        'url' => $this->getOutlookUrl,
        'api_key_length' => strlen($this->apiKey),
        'data_keys' => array_keys($data),
        'data' => $data
      ]);

      $response = Http::withHeaders([
        'HR_AGENT_CVINTAKE' => $this->password,
        'Content-Type' => 'application/json',
      ])
        ->timeout(60)
        ->post($this->getOutlookUrl, $data);

      // Log the raw response for debugging
      Log::info('HrAgent get Outlook webhook raw response', [
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
          Log::warning('HrAgent get Outlook webhook response is not valid JSON', [
            'body' => $response->body(),
            'json_error' => $jsonException->getMessage()
          ]);
        }

        Log::info('HrAgent get Outlook webhook triggered successfully', [
          'status_code' => $response->status(),
          'response' => $responseData
        ]);

        return [
          'success' => true,
          'data' => $responseData,
          'status_code' => $response->status()
        ];
      } else {
        Log::error('HrAgent get Outlook webhook failed', [
          'status_code' => $response->status(),
          'response' => $response->body(),
          'headers' => $response->headers()
        ]);

        return [
          'success' => false,
          'error' => 'Webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body()
        ];
      }
    } catch (\Exception $e) {
      Log::error('HrAgent get Outlook webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'url' => $this->getOutlookUrl ?? 'not set',
        'api_key_set' => !empty($this->apiKey)
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage()
      ];
    }
  }
}
