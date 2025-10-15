<?php

namespace App\Services\Agents\QNAAgent;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QNAAgentChatService
{
  private string $chatWebhookUrl;
  private string $jwtSecret;

  public function __construct()
  {
    $this->chatWebhookUrl = config('services.qna_agent_chat.webhook_url');
    $this->jwtSecret = config('services.qna_agent_chat.jwt_secret');
  }

  /**
   * Generate JWT token for authentication
   *
   * @param array $payload
   * @return string
   */
  private function generateJWTToken(array $payload = []): string
  {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

    // Add default payload data
    $defaultPayload = [
      'iat' => time(),
      'exp' => time() + (60 * 60), // 1 hour expiration
    ];

    $payload = array_merge($defaultPayload, $payload);
    $payload = json_encode($payload);

    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, $this->jwtSecret, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64Header . "." . $base64Payload . "." . $base64Signature;
  }

  /**
   * Send message to ReportAgent chat webhook and get response
   *
   * @param array $data
   * @return array
   */
  public function sendMessage(array $data = []): array
  {
    try {
      // Generate JWT token for authentication
      $jwtToken = $this->generateJWTToken([
        'userId' => $data['userId'] ?? null,
        'sessionId' => $data['sessionId'] ?? null,
      ]);

      // Prepare the payload according to N8N workflow requirements
      $payload = [
        'chatInput' => $data['chatInput'] ?? '',
        'userId' => $data['userId'] ?? null,
        'sessionId' => $data['conversationId'] ?? null,
      ];

      Log::info('QNAAgentChatService: Sending message to webhook', [
        'webhook_url' => $this->chatWebhookUrl,
        'payload' => $payload
      ]);

      $response = Http::timeout(60) // Increased timeout for chat responses
        ->withHeaders([
          'Authorization' => 'Bearer ' . $jwtToken,
        ])
        ->post($this->chatWebhookUrl, $payload);

      // $response = Http::timeout(6000000) // Increased timeout for chat responses
      //   ->post($this->chatWebhookUrl, $data);

      if ($response->successful()) {
        Log::info('QNAAgentChatService: Chat webhook response received successfully', [
          'status_code' => $response->status(),
          'response' => $response->json()
        ]);

        return [
          'success' => true,
          'data' => $response->json(),
          'status_code' => $response->status()
        ];
      } else {
        Log::error('QNAAgentChatService: Chat webhook failed', [
          'status_code' => $response->status(),
          'response_body' => $response->body(),
          'webhook_url' => $this->chatWebhookUrl
        ]);

        return [
          'success' => false,
          'error' => 'Chat webhook request failed',
          'status_code' => $response->status(),
          'response' => $response->body()
        ];
      }
    } catch (\Exception $e) {
      Log::error('QNAAgentChatService: Chat webhook exception', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'webhook_url' => $this->chatWebhookUrl
      ]);

      return [
        'success' => false,
        'error' => $e->getMessage()
      ];
    }
  }

  /**
   * Get chat webhook URL for debugging
   *
   * @return string
   */
  public function getChatWebhookUrl(): string
  {
    return $this->chatWebhookUrl;
  }
}
