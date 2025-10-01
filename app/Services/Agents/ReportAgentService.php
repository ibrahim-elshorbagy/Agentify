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

          $response = Http::
          withHeaders([
                    'X-API-Key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->
                timeout(30)
                ->post($this->webhookUrl, $data);

            if ($response->successful()) {
                Log::info('ReportAgent webhook triggered successfully', [
                    'status_code' => $response->status(),
                    'response' => $response->json()
                ]);

                return [
                    'success' => true,
                    'data' => $response->json(),
                    'status_code' => $response->status()
                ];
            } else {
                Log::error('ReportAgent webhook failed', [
                    'status_code' => $response->status(),
                    'response' => $response->body()
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
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
