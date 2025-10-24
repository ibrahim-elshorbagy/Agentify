<?php

namespace App\Http\Controllers\User\Agents\EmailAgent;

use App\Http\Controllers\Controller;
use App\Models\Site\UserCredential;
use App\Models\Agent\EmailAgent\Message;
use App\Models\User\UserSettings;
use App\Services\Agents\EmailAgent\EmailAgentService;
use App\Services\OAuth\GoogleOAuthService;
use App\Services\OAuth\MicrosoftOAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Carbon\Carbon;

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
   * Get user's folder settings with boolean values
   * Returns all folder settings as boolean (true/false)
   * If setting doesn't exist, returns false as default
   */
  protected function getUserFolderSettings($userId)
  {
    // Define all possible folders and actions
    $folders = ['inbox', 'spam', 'promotions', 'social', 'personal', 'clients', 'team', 'finance', 'hr', 'other'];
    $actions = ['is_read', 'is_starred', 'is_bin', 'is_archived'];

    // Get all user settings for 'auto' name with keys starting with 'folder_'
    $settings = UserSettings::where('user_id', $userId)
      ->where('name', 'auto')
      ->where('key', 'like', 'folder_%')
      ->pluck('value', 'key');

    // Build the settings array with all possible combinations
    $folderSettings = [];
    foreach ($folders as $folder) {
      foreach ($actions as $action) {
        $key = "folder_{$folder}_{$action}";

        // Convert string 'true'/'false' to boolean, default to false if not exists
        if (isset($settings[$key])) {
          $folderSettings[$key] = filter_var($settings[$key], FILTER_VALIDATE_BOOLEAN);
        } else {
          $folderSettings[$key] = false;
        }
      }
    }

    return $folderSettings;
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
      $lastReadAt = Message::where('user_id', Auth::id())
        ->where('source', 'gmail')
        ->latest('created_at')
        ->value('created_at');

      // Convert to Unix epoch (integer)
      $afterEpoch = $lastReadAt
        ? Carbon::parse($lastReadAt, 'UTC')->timestamp
        : Carbon::parse('2002-01-01 13:45:27', 'UTC')->timestamp;

      // Get user's folder settings
      $folderSettings = $this->getUserFolderSettings(Auth::id());

      // Prepare base data for N8N webhook
      $baseData = [
        'user_id' => Auth::id(),
        'access_token' => $validAccessToken,
        'provider' => 'gmail',
        'last_read' => $afterEpoch,
        'folder_inbox' => 'inbox',
        'folder_spam' => 'spam',
        'folder_bin' => 'bin',
        'folder_promotions' => 'promotions',
        'folder_social' => 'social',
        'folder_personal' => 'personal',
        'folder_clients' => 'clients',
        'folder_team' => 'team',
        'folder_finance' => 'finance',
        'folder_hr' => 'hr',
        'folder_other' => 'other',
        
        "sent_status"=>"sent",
        "draft_status"=>"draft",

      ];

      // Merge base data with folder settings
      $data = array_merge($baseData, $folderSettings);

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
      $lastReadAt = Message::where('user_id', Auth::id())
        ->where('source', 'outlook')
        ->latest('created_at')
        ->value('created_at');

      // Convert to Unix epoch (integer)
      $afterEpoch = $lastReadAt
        ? Carbon::parse($lastReadAt, 'UTC')->timestamp
        : Carbon::parse('2002-01-01 13:45:27', 'UTC')->timestamp;

      // Get user's folder settings
      $folderSettings = $this->getUserFolderSettings(Auth::id());

      // Prepare base data for N8N webhook
      $baseData = [
        'user_id' => Auth::id(),
        'access_token' => $validAccessToken,
        'provider' => 'outlook',
        'last_read' => $afterEpoch,
        'folder_inbox' => 'inbox',
        'folder_spam' => 'spam',
        'folder_promotions' => 'promotions',
        'folder_social' => 'social',
        'folder_personal' => 'personal',
        'folder_clients' => 'clients',
        'folder_team' => 'team',
        'folder_finance' => 'finance',
        'folder_hr' => 'hr',
        'folder_other' => 'other',

        "sent_status"=>"sent",
        "draft_status"=>"draft",
      ];

      // Merge base data with folder settings
      $data = array_merge($baseData, $folderSettings);

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
