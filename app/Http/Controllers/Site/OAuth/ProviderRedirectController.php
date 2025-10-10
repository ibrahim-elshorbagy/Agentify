<?php

namespace App\Http\Controllers\Site\OAuth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class ProviderRedirectController extends Controller
{
  /**
   * Redirect to OAuth provider for email connection only
   */
  public function __invoke(Request $request, string $provider)
  {
    // Only allow google and microsoft providers for email connections
    if (!in_array($provider, ['google', 'microsoft']) || !config("services.{$provider}")) {
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
      // Store the redirect URL in session if it exists
      if ($request->has('redirect')) {
        session(['oauth_redirect' => $request->get('redirect')]);
      }

      Log::info('Redirecting to OAuth provider for email connection', [
        'user_id' => Auth::id(),
        'provider' => $provider
      ]);

      $driver = Socialite::driver($provider);

      // Configure Google-specific settings for email reading ONLY
      if ($provider === 'google') {
        return $driver
          ->scopes([
            'https://www.googleapis.com/auth/gmail.readonly'
          ])
          ->with([
            'access_type' => 'offline',
            'prompt' => 'consent'
          ])
          ->redirect();
      }

      // Configure Microsoft-specific settings for email reading ONLY
      if ($provider === 'microsoft') {
        return $driver
          ->scopes([
            'https://graph.microsoft.com/Mail.Read',
            'offline_access'
          ])
          ->redirect();
      }

    } catch (\Exception $e) {
      Log::error('OAuth redirect failed for email connection', [
        'user_id' => Auth::id(),
        'provider' => $provider,
        'error' => $e->getMessage()
      ]);

      return redirect()->route('profile.edit', ['section' => 'connections'])->with([
        'title' => __('website_response.oauth_redirect_error_title'),
        'message' => __('website_response.oauth_redirect_error_message', ['provider' => ucfirst($provider)]),
        'status' => 'error'
      ]);
    }
  }
}
