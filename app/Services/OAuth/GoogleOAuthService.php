<?php

namespace App\Services\OAuth;

use App\Models\Site\UserCredential;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class GoogleOAuthService
{
    private string $clientId;
    private string $clientSecret;
    private string $tokenUrl = 'https://oauth2.googleapis.com/token';

    public function __construct()
    {
        $this->clientId = config('services.google.client_id');
        $this->clientSecret = config('services.google.client_secret');
    }

    /**
     * Get a fresh access token for a user credential
     */
    public function getFreshAccessToken(UserCredential $credential): ?string
    {
        if (!$credential->isGmail()) {
            Log::error('GoogleOAuthService: Credential is not for Google');
            return null;
        }

        if (!$credential->provider_refresh_token) {
            Log::error('GoogleOAuthService: No refresh token available', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id
            ]);
            return null;
        }

        try {
            Log::info('GoogleOAuthService: Refreshing access token', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id
            ]);

            $response = Http::asForm()->post($this->tokenUrl, [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'refresh_token' => $credential->provider_refresh_token,
                'grant_type' => 'refresh_token',
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

                    Log::info('GoogleOAuthService: Access token refreshed successfully', [
                        'user_id' => $credential->user_id,
                        'credential_id' => $credential->id
                    ]);

                    return $tokenData['access_token'];
                }
            }

            Log::error('GoogleOAuthService: Failed to refresh access token', [
                'user_id' => $credential->user_id,
                'credential_id' => $credential->id,
                'status_code' => $response->status(),
                'response' => $response->json()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('GoogleOAuthService: Exception during token refresh', [
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
            ])->get('https://www.googleapis.com/oauth2/v1/tokeninfo');

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('GoogleOAuthService: Exception during token test', [
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
            Log::warning('GoogleOAuthService: No access token stored');
            return null;
        }

        // Log the token from database for debugging
        Log::info('GoogleOAuthService: Token from database', [
            'user_id' => $credential->user_id,
            'credential_id' => $credential->id,
            'token_length' => strlen($credential->provider_token),
            'token_first_10' => substr($credential->provider_token, 0, 10),
            'token_last_10' => substr($credential->provider_token, -10),
            'full_token' => $credential->provider_token
        ]);

        // First, try the existing token
        if ($this->testAccessToken($credential->provider_token)) {
            Log::info('GoogleOAuthService: Existing access token is valid', [
                'using_database_token' => true,
                'token' => $credential->provider_token
            ]);
            return $credential->provider_token;
        }

        // Token is invalid/expired, try to refresh it
        Log::info('GoogleOAuthService: Access token invalid, attempting refresh');
        $refreshedToken = $this->getFreshAccessToken($credential);

        if ($refreshedToken) {
            Log::info('GoogleOAuthService: Using refreshed token', [
                'refreshed_token' => $refreshedToken,
                'token_length' => strlen($refreshedToken)
            ]);
        }

        return $refreshedToken;
    }
}
