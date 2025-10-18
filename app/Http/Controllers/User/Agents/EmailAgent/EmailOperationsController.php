<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use App\Models\Agent\EmailAgent\Message;
use App\Services\Agents\EmailAgent\EmailAgentService;
use App\Services\OAuth\GoogleOAuthService;
use App\Services\OAuth\MicrosoftOAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EmailOperationsController extends Controller
{
  use AuthorizesRequests;

  protected EmailAgentService $emailAgentService;
  protected GoogleOAuthService $googleOAuthService;
  protected MicrosoftOAuthService $microsoftOAuthService;

  public function __construct(
    EmailAgentService $emailAgentService,
    GoogleOAuthService $googleOAuthService,
    MicrosoftOAuthService $microsoftOAuthService
  ) {
    $this->emailAgentService = $emailAgentService;
    $this->googleOAuthService = $googleOAuthService;
    $this->microsoftOAuthService = $microsoftOAuthService;
  }

  /**
   * Get Gmail emails via Email Agent
   */
  public function getGmail(Request $request)
  {
    try {
      // Get user's Gmail credentials
      $gmailCredential = UserCredential::forUser(Auth::id())
        ->forProvider('google')
        ->first();

      if (!$gmailCredential) {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', __('website_response.no_gmail_connection'))
          ->with('status', 'error');
      }

      // Get a fresh, valid access token
      $validAccessToken = $this->googleOAuthService->getValidAccessToken($gmailCredential);

      if (!$validAccessToken) {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', __('website_response.gmail_token_invalid'))
          ->with('status', 'error');
      }

      // Log the final token being sent to webhook
      Log::info('EmailOperationsController: Final token being sent to webhook', [
        'user_id' => Auth::id(),
        'token_length' => strlen($validAccessToken),
        'token_prefix' => substr($validAccessToken, 0, 20) . '...',
        'is_same_as_database' => $validAccessToken === $gmailCredential->provider_token
      ]);

      // Get the last read timestamp for Gmail messages
      $lastRead = Message::where('user_id', Auth::id())
        ->where('source', 'gmail')
        ->orderBy('created_at', 'desc')
        ->value('created_at') ?? '2002-01-01 00:00:00';

      // Prepare data for N8N webhook
      $data = [
        'user_id' => Auth::id(),
        'access_token' => $validAccessToken,
        'provider' => 'gmail',
        'last_read' => $lastRead
      ];

      // Call Email Agent service
      $result = $this->emailAgentService->getGmail($data);

      if ($result['success']) {
        return back()
          ->with('title', __('website_response.success_title'))
          ->with('message', $result['message'])
          ->with('status', 'success');
      } else {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', $result['message'])
          ->with('status', 'error');
      }
    } catch (\Exception $e) {
      Log::error('EmailOperationsController getGmail error', [
        'error' => $e->getMessage(),
        'user_id' => Auth::id()
      ]);

      return back()
        ->with('title', __('website_response.error_title'))
        ->with('message', __('website_response.something_went_wrong'))
        ->with('status', 'error');
    }
  }

  /**
   * Get Outlook emails via Email Agent
   */
  public function getOutlook()
  {
    try {
      // Get user's Microsoft credentials
      $outlookCredential = UserCredential::forUser(Auth::id())
        ->forProvider('microsoft')
        ->first();

      if (!$outlookCredential) {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', __('website_response.no_outlook_connection'))
          ->with('status', 'error');
      }

      // Get a fresh, valid access token
      $validAccessToken = $this->microsoftOAuthService->getValidAccessToken($outlookCredential);

      if (!$validAccessToken) {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', __('website_response.outlook_token_invalid'))
          ->with('status', 'error');
      }

      // Get the last read timestamp for Outlook messages
      $lastRead = Message::where('user_id', Auth::id())
        ->where('source', 'outlook')
        ->orderBy('created_at', 'desc')
        ->value('created_at') ?? '2002-01-01 00:00:00';

      // Prepare data for N8N webhook
      $data = [
        'user_id' => Auth::id(),
        'access_token' => $validAccessToken,
        'provider' => 'outlook',
        'last_read' => $lastRead
      ];

      // Call Email Agent service
      $result = $this->emailAgentService->getOutlook($data);

      if ($result['success']) {
        return back()
          ->with('title', __('website_response.success_title'))
          ->with('message', $result['message'])
          ->with('status', 'success');
      } else {
        return back()
          ->with('title', __('website_response.error_title'))
          ->with('message', $result['message'])
          ->with('status', 'error');
      }
    } catch (\Exception $e) {
      Log::error('EmailOperationsController getOutlook error', [
        'error' => $e->getMessage(),
        'user_id' => Auth::id()
      ]);

      return back()
        ->with('title', __('website_response.error_title'))
        ->with('message', __('website_response.something_went_wrong'))
        ->with('status', 'error');
    }
  }
}
