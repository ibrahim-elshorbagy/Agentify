<?php

namespace App\Http\Controllers\Site\OAuth;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class ProviderCallbackController extends Controller
{
  /**
   * Handle OAuth callback for email connection only
   */
  public function __invoke(string $provider)
  {
    // Only allow google and outlook providers for email connections
    if (!in_array($provider, ['google', 'outlook']) || !config("services.{$provider}")) {
      return redirect()->route('profile.edit', ['section' => 'connections'])->with([
        'title' => __('website_response.oauth_provider_invalid_title'),
        'message' => __('website_response.oauth_provider_invalid_message'),
        'status' => 'error'
      ]);
    }

    // User must be authenticated to connect email accounts
    if (!Auth::check()) {
      return redirect()->route('login')->with([
        'title' => __('website_response.oauth_authentication_required_title'),
        'message' => __('website_response.oauth_authentication_required_message'),
        'status' => 'error'
      ]);
    }

    try {
      $socialUser = Socialite::driver($provider)->user();

      if (!$socialUser->getEmail()) {
        return redirect()->route('profile.edit', ['section' => 'connections'])->with([
          'title' => __('website_response.oauth_no_email_title'),
          'message' => __('website_response.oauth_no_email_message', ['provider' => ucfirst($provider)]),
          'status' => 'error'
        ]);
      }

      $user = Auth::user();

      // Store or update the user credential for email access
      UserCredential::updateOrCreate([
        'user_id' => $user->id,
        'provider_name' => $provider,
      ], [
        'provider_id' => $socialUser->getId(),
        'provider_token' => $socialUser->token ?? null,
        'provider_refresh_token' => $socialUser->refreshToken ?? null,
      ]);

      Log::info('Email account connected successfully', [
        'user_id' => $user->id,
        'provider' => $provider,
        'provider_id' => $socialUser->getId(),
        'email' => $socialUser->getEmail()
      ]);

      // Get stored redirect URL or default to connections page
      $redirectUrl = session()->pull('oauth_redirect', route('profile.edit', ['section' => 'connections']));

      return redirect($redirectUrl)->with([
        'title' => __('website_response.oauth_connection_success_title'),
        'message' => __('website_response.oauth_connection_success_message', ['provider' => ucfirst($provider)]),
        'status' => 'success'
      ]);

    } catch (\Exception $e) {
      Log::error('OAuth email connection failed', [
        'user_id' => Auth::id(),
        'provider' => $provider,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);

      return redirect()->route('profile.edit', ['section' => 'connections'])->with([
        'title' => __('website_response.oauth_connection_error_title'),
        'message' => __('website_response.oauth_connection_error_message', ['provider' => ucfirst($provider)]),
        'status' => 'error'
      ]);
    }
  }
}
