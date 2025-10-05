<?php

namespace App\Services\Agents;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ReportAgentService
{
    private string $webhookUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->webhookUrl = config('services.report_agent.webhook_url');
        $this->apiKey = config('services.report_agent.api_key');
    }

    /**
     * Trigger the ReportAgent webhook
     *
     * @param array $data
     * @return array
     */
    public function triggerWebhook(array $data = []): array
    {
        try {
            // Log the request details for debugging
            Log::info('ReportAgent webhook request starting', [
                'url' => $this->webhookUrl,
                'api_key_length' => strlen($this->apiKey),
                'data_keys' => array_keys($data),
                'data' => $data
            ]);

            $response = Http::withHeaders([
                'REPORTS_AGENT_UPLOADFILES' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout(60) // Reduced from 6000000 to reasonable 60 seconds
            ->post($this->webhookUrl, $data);

            // Log the raw response for debugging
            Log::info('ReportAgent webhook raw response', [
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
                    Log::warning('ReportAgent webhook response is not valid JSON', [
                        'body' => $response->body(),
                        'json_error' => $jsonException->getMessage()
                    ]);
                }

                Log::info('ReportAgent webhook triggered successfully', [
                    'status_code' => $response->status(),
                    'response' => $responseData
                ]);

                return [
                    'success' => true,
                    'data' => $responseData,
                    'status_code' => $response->status()
                ];
            } else {
                Log::error('ReportAgent webhook failed', [
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
            Log::error('ReportAgent webhook exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'url' => $this->webhookUrl ?? 'not set',
                'api_key_set' => !empty($this->apiKey)
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
