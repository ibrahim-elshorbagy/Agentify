<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class N8nWebhookService
{
    private string $webhookUrl;
    private string $username;
    private string $password;

    public function __construct()
    {
        $this->webhookUrl = config('services.n8n.webhook_url');
        $this->username = config('services.n8n.username');
        $this->password = config('services.n8n.password');
    }

    /**
     * Trigger the n8n webhook
     *
     * @param array $data
     * @return array
     */
    public function triggerWebhook(array $data = []): array
    {
        try {
            $response = Http::withBasicAuth($this->username, $this->password)
                ->timeout(30)
                ->post($this->webhookUrl, $data);

            if ($response->successful()) {
                Log::info('N8N webhook triggered successfully', [
                    'status_code' => $response->status(),
                    'response' => $response->json()
                ]);

                return [
                    'success' => true,
                    'data' => $response->json(),
                    'status_code' => $response->status()
                ];
            } else {
                Log::error('N8N webhook failed', [
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
            Log::error('N8N webhook exception', [
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
