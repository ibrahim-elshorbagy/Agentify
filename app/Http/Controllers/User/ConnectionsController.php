<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use App\Services\OAuth\GoogleOAuthService;
use App\Services\OAuth\MicrosoftOAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ConnectionsController extends Controller
{
  protected GoogleOAuthService $googleOAuthService;
  protected MicrosoftOAuthService $microsoftOAuthService;

  public function __construct(
    GoogleOAuthService $googleOAuthService,
    MicrosoftOAuthService $microsoftOAuthService
  ) {
    $this->googleOAuthService = $googleOAuthService;
    $this->microsoftOAuthService = $microsoftOAuthService;
  }

  /**
   * Initiate connection to a provider
   */
  public function connect(string $provider)
  {
    if (!in_array($provider, ['google', 'microsoft'])) {
      return back()->with([
        'title' => __('website_response.oauth_provider_invalid_title'),
        'message' => __('website_response.oauth_provider_invalid_message'),
        'status' => 'error'
      ]);
    }

    // Redirect to OAuth for email connection
    return redirect()->route('auth.redirect', [
      'provider' => $provider,
      'redirect' => route('profile.edit', ['section' => 'connections'])
    ]);
  }


  /**
   * Disconnect a provider
   */
  public function disconnect(Request $request, string $provider)
  {
    if (!in_array($provider, ['google', 'microsoft'])) {
      return back()->with([
        'title' => __('website_response.oauth_provider_invalid_title'),
        'message' => __('website_response.oauth_provider_invalid_message'),
        'status' => 'error'
      ]);
    }

    $user = Auth::user();

    try {
      $credential = UserCredential::where('user_id', $user->id)
        ->where('provider_name', $provider)
        ->first();

      if (!$credential) {
        return back()->with([
          'title' => __('website_response.oauth_not_connected_title'),
          'message' => __('website_response.oauth_not_connected_message', ['provider' => ucfirst($provider)]),
          'status' => 'error'
        ]);
      }

      $credential->delete();

      Log::info('User disconnected provider', [
        'user_id' => $user->id,
        'provider' => $provider
      ]);

      return back()->with([
        'title' => __('website_response.oauth_disconnect_success_title'),
        'message' => __('website_response.oauth_disconnect_success_message', ['provider' => ucfirst($provider)]),
        'status' => 'success'
      ]);

    } catch (\Exception $e) {
      Log::error('Failed to disconnect provider', [
        'user_id' => $user->id,
        'provider' => $provider,
        'error' => $e->getMessage()
      ]);

      return back()->with([
        'title' => __('website_response.oauth_disconnect_error_title'),
        'message' => __('website_response.oauth_disconnect_error_message'),
        'status' => 'error'
      ]);
    }
  }


  /**
   * Test connection to a provider by validating the access token
   */
  public function testConnection(string $provider)
  {
    $user = Auth::user();

    $credential = UserCredential::where('user_id', $user->id)
      ->where('provider_name', $provider)
      ->first();

    if (!$credential) {
      return back()->with([
        'title' => __('website_response.oauth_not_connected_title'),
        'message' => __('website_response.oauth_not_connected_message', ['provider' => ucfirst($provider)]),
        'status' => 'error'
      ]);
    }

    if (empty($credential->provider_token)) {
      return back()->with([
        'title' => __('website_response.oauth_token_missing_title'),
        'message' => __('website_response.oauth_token_missing_message'),
        'status' => 'error'
      ]);
    }

    try {
      $latestEmail = null;

      if ($provider === 'google') {
        // Use GoogleOAuthService to get valid token (same as HR Agent)
        $validToken = $this->googleOAuthService->getValidAccessToken($credential);

        if (!$validToken) {
          return back()->with([
            'title' => __('website_response.oauth_token_expired_title'),
            'message' => __('website_response.oauth_token_expired_message'),
            'status' => 'error'
          ]);
        }

        Log::info('Test connection using refreshed token', [
          'user_id' => $credential->user_id,
          'provider' => $provider,
          'token_refreshed' => $validToken !== $credential->provider_token
        ]);

        $latestEmail = $this->fetchLatestGmailEmail($validToken);
      } elseif ($provider === 'microsoft') {
        // Use MicrosoftOAuthService to get valid token (same as HR Agent)
        $validToken = $this->microsoftOAuthService->getValidAccessToken($credential);

        if (!$validToken) {
          return back()->with([
            'title' => __('website_response.oauth_token_expired_title'),
            'message' => __('website_response.oauth_token_expired_message'),
            'status' => 'error'
          ]);
        }

        Log::info('Test connection using refreshed token', [
          'user_id' => $credential->user_id,
          'provider' => $provider,
          'token_refreshed' => $validToken !== $credential->provider_token
        ]);

        $latestEmail = $this->fetchLatestMicrosoftEmail($validToken);
      }

      if ($latestEmail) {
        return back()->with([
          'title' => __('website_response.oauth_test_success_title'),
          'message' => __('website_response.oauth_test_success_message') . ' Subject: ' . $latestEmail['subject'] . ' | From: ' . $latestEmail['from'],
          'status' => 'success'
        ]);
      } else {
        return back()->with([
          'title' => __('website_response.oauth_test_no_emails_title'),
          'message' => __('website_response.oauth_test_no_emails_message'),
          'status' => 'warning'
        ]);
      }

    } catch (\Exception $e) {
      Log::error('Email fetch test failed', [
        'user_id' => $user->id,
        'provider' => $provider,
        'error' => $e->getMessage()
      ]);

      return back()->with([
        'title' => __('website_response.oauth_test_failed_title'),
        'message' => __('website_response.oauth_test_failed_message'),
        'status' => 'error'
      ]);
    }
  }

  /**
   * Fetch latest Gmail email using Google API
   */
  private function fetchLatestGmailEmail(string $accessToken)
  {
    try {
      // Get list of messages (latest first)
      $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $accessToken,
        'Accept' => 'application/json'
      ])->get('https://gmail.googleapis.com/gmail/v1/users/me/messages', [
        'maxResults' => 1,
        'q' => 'in:inbox'
      ]);

      if (!$response->successful()) {
        Log::error('Failed to fetch Gmail messages list', [
          'status_code' => $response->status(),
          'response' => $response->json()
        ]);
        return null;
      }

      $data = $response->json();

      if (empty($data['messages'])) {
        return [
          'subject' => 'No emails found',
          'from' => 'N/A',
          'date' => 'N/A',
          'snippet' => 'No emails in inbox'
        ];
      }

      $messageId = $data['messages'][0]['id'];

      // Get message details
      $messageResponse = Http::withHeaders([
        'Authorization' => 'Bearer ' . $accessToken,
        'Accept' => 'application/json'
      ])->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}", [
        'format' => 'metadata',
        'metadataHeaders' => ['Subject', 'From', 'Date']
      ]);

      if (!$messageResponse->successful()) {
        Log::error('Failed to fetch Gmail message details', [
          'message_id' => $messageId,
          'status_code' => $messageResponse->status(),
          'response' => $messageResponse->json()
        ]);
        // Return basic info from list if full fetch fails
        return [
          'subject' => 'Email found but details unavailable',
          'from' => 'N/A',
          'date' => 'N/A',
          'snippet' => 'Connection successful'
        ];
      }

      $message = $messageResponse->json();
      $headers = collect($message['payload']['headers'] ?? []);

      return [
        'subject' => $headers->firstWhere('name', 'Subject')['value'] ?? 'No subject',
        'from' => $headers->firstWhere('name', 'From')['value'] ?? 'Unknown sender',
        'date' => $headers->firstWhere('name', 'Date')['value'] ?? 'Unknown date',
        'snippet' => $message['snippet'] ?? 'No preview available'
      ];

    } catch (\Exception $e) {
      Log::error('Gmail API error in fetchLatestGmailEmail', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return null;
    }
  }

  /**
   * Fetch latest Microsoft email using Microsoft Graph API
   */
  private function fetchLatestMicrosoftEmail(string $accessToken)
  {
    try {
      $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . $accessToken,
        'Accept' => 'application/json'
      ])->get('https://graph.microsoft.com/v1.0/me/messages', [
        '$top' => 1,
        '$orderby' => 'receivedDateTime desc',
        '$select' => 'subject,from,receivedDateTime,bodyPreview'
      ]);

      if (!$response->successful()) {
        Log::error('Failed to fetch Outlook messages', [
          'status_code' => $response->status(),
          'response' => $response->json()
        ]);
        return null;
      }

      $data = $response->json();

      if (empty($data['value'])) {
        return [
          'subject' => 'No emails found',
          'from' => 'N/A',
          'date' => 'N/A',
          'snippet' => 'No emails in mailbox'
        ];
      }

      $message = $data['value'][0];

      return [
        'subject' => $message['subject'] ?? 'No subject',
        'from' => $message['from']['emailAddress']['address'] ?? 'Unknown sender',
        'date' => $message['receivedDateTime'] ?? 'Unknown date',
        'snippet' => $message['bodyPreview'] ?? 'No preview available'
      ];

    } catch (\Exception $e) {
      Log::error('Outlook API error in fetchLatestMicrosoftEmail', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return null;
    }
  }
}
