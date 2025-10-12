<?php

namespace App\Services\OAuth;

use App\Models\Site\UserCredential;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MicrosoftOAuthService
{
    private string $clientId;
    private string $clientSecret;
    private string $tokenUrl;

    public function __construct()
    {
        $this->clientId = config('services.microsoft.client_id');
        $this->clientSecret = config('services.microsoft.client_secret');
        $tenantId = config('services.microsoft.tenant', 'common');
        $this->tokenUrl = "https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token";
    }

    /**
     * Get a fresh access token for a user credential
     */
    public function getFreshAccessToken(UserCredential $credential): ?string
    {
        if (!$credential->isMicrosoft()) {
            Log::error('MicrosoftOAuthService: Credential is not for Microsoft');
            return null;
        }

        if (!$credential->provider_refresh_token) {
            Log::error('MicrosoftOAuthService: No refresh token available', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id
            ]);
            return null;
        }

        try {
            Log::info('MicrosoftOAuthService: Refreshing access token', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id
            ]);

            $response = Http::asForm()->post($this->tokenUrl, [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $credential->provider_refresh_token,
                'grant_type' => 'refresh_token',
                'scope' => 'https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/User.Read offline_access',
            ]);

            if ($response->successful()) {
                $tokenData = $response->json();

                if (isset($tokenData['access_token'])) {
                    // Update the credential with new access token
                    $credential->update([
                        'provider_token' => $tokenData['access_token'],
                        // If a new refresh token is provided, update it too
                        'provider_refresh_token' => $tokenData['refresh_token'] ?? $credential->provider_refresh_token,
                    ]);

                    Log::info('MicrosoftOAuthService: Access token refreshed successfully', [
                        'user_id' => $credential->user_id,
                        'credential_id' => $credential->id
                    ]);

                    return $tokenData['access_token'];
                }
            }

            Log::error('MicrosoftOAuthService: Failed to refresh access token', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id,
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('MicrosoftOAuthService: Exception during token refresh', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return null;
        }
    }

    /**
     * Test if an access token is valid by making a test API call
     */
    public function testAccessToken(string $accessToken): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
            ])->get('https://graph.microsoft.com/v1.0/me');

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('MicrosoftOAuthService: Exception during token test', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get a valid access token, refreshing if necessary
     */
    public function getValidAccessToken(UserCredential $credential): ?string
    {
        if (!$credential->provider_token) {
            Log::warning('MicrosoftOAuthService: No access token stored');
            return null;
        }

        // First, try the existing token
        if ($this->testAccessToken($credential->provider_token)) {
            Log::info('MicrosoftOAuthService: Existing access token is valid');
            return $credential->provider_token;
        }

        // Token is invalid/expired, try to refresh it
        Log::info('MicrosoftOAuthService: Access token invalid, attempting refresh');
        return $this->getFreshAccessToken($credential);
    }
}
