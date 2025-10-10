<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ConnectionsController extends Controller
{
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
   * Test connection to a provider by fetching latest email
   */
  public function testConnection(string $provider)
  {
    $user = Auth::user();

    $credential = UserCredential::where('user_id', $user->id)
      ->where('provider_name', $provider)
      ->first();

    if (!$credential) {
      return response()->json([
        'success' => false,
        'message' => __('website_response.oauth_not_connected_message', ['provider' => ucfirst($provider)])
      ]);
    }

    if (empty($credential->provider_token)) {
      return response()->json([
        'success' => false,
        'message' => 'No access token found. Please reconnect your account.'
      ]);
    }

    try {
      $latestEmail = null;

      if ($provider === 'google') {
        $latestEmail = $this->fetchLatestGmailEmail($credential->provider_token);
      } elseif ($provider === 'microsoft') {
        $latestEmail = $this->fetchLatestMicrosoftEmail($credential->provider_token);
      }

      if ($latestEmail) {
        return response()->json([
          'success' => true,
          'message' => 'Connection successful! Latest email retrieved.',
          'data' => $latestEmail
        ]);
      } else {
        return response()->json([
          'success' => false,
          'message' => 'Connected but unable to fetch emails. Check permissions.'
        ]);
      }

    } catch (\Exception $e) {
      Log::error('Email fetch test failed', [
        'user_id' => $user->id,
        'provider' => $provider,
        'error' => $e->getMessage()
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Connection test failed: ' . $e->getMessage()
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
        throw new \Exception('Failed to fetch Gmail messages: ' . $response->body());
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
      ])->get("https://gmail.googleapis.com/gmail/v1/users/me/messages/{$messageId}");

      if (!$messageResponse->successful()) {
        throw new \Exception('Failed to fetch Gmail message details');
      }

      $message = $messageResponse->json();
      $headers = collect($message['payload']['headers']);

      return [
        'subject' => $headers->firstWhere('name', 'Subject')['value'] ?? 'No subject',
        'from' => $headers->firstWhere('name', 'From')['value'] ?? 'Unknown sender',
        'date' => $headers->firstWhere('name', 'Date')['value'] ?? 'Unknown date',
        'snippet' => $message['snippet'] ?? 'No preview available'
      ];

    } catch (\Exception $e) {
      throw new \Exception('Gmail API error: ' . $e->getMessage());
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
        throw new \Exception('Failed to fetch Outlook messages: ' . $response->body());
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
      throw new \Exception('Outlook API error: ' . $e->getMessage());
    }
  }
}
