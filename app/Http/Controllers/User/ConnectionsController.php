<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ConnectionsController extends Controller
{
  /**
   * Initiate connection to a provider
   */
  public function connect(string $provider)
  {
    if (!in_array($provider, ['google', 'outlook'])) {
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
    if (!in_array($provider, ['google', 'outlook'])) {
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
   * Test connection to a provider
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

    // Here you would test the actual connection to the email service
    // For now, we'll just check if we have tokens
    $hasToken = !empty($credential->provider_token);

    return response()->json([
      'success' => $hasToken,
      'message' => $hasToken
        ? __('website_response.oauth_connection_test_success', ['provider' => ucfirst($provider)])
        : __('website_response.oauth_connection_test_failed', ['provider' => ucfirst($provider)])
    ]);
  }
}
