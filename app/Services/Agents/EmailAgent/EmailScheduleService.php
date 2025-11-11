<?php

namespace App\Services\Agents\EmailAgent;

use App\Models\Agent\EmailAgent\Message;
use App\Models\Site\UserCredential;
use App\Models\User;
use App\Models\User\UserSettings;
use App\Services\OAuth\GoogleOAuthService;
use App\Services\OAuth\MicrosoftOAuthService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class EmailScheduleService
{
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
     * Check all users and execute scheduled email fetches
     */
    public function checkAndExecuteScheduledFetches()
    {
        try {
            $currentTime = Carbon::now()->format('H:i');

            Log::info('EmailScheduleService: Checking scheduled fetches', [
                'current_time' => $currentTime,
            ]);

            // Get all users with email fetch schedules
            $googleSchedules = UserSettings::where('name', 'schedule')
                ->where('key', 'email_agent_google_fetch_time')
                ->whereNotNull('value')
                ->get();

            $outlookSchedules = UserSettings::where('name', 'schedule')
                ->where('key', 'email_agent_outlook_fetch_time')
                ->whereNotNull('value')
                ->get();

            // Process Google schedules
            foreach ($googleSchedules as $schedule) {
                $this->processGoogleSchedule($schedule, $currentTime);
            }

            // Process Outlook schedules
            foreach ($outlookSchedules as $schedule) {
                $this->processOutlookSchedule($schedule, $currentTime);
            }

            Log::info('EmailScheduleService: Completed scheduled fetches check');

        } catch (\Exception $e) {
            Log::error('EmailScheduleService: Error in checkAndExecuteScheduledFetches', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Process Google email fetch schedule for a user
     */
    protected function processGoogleSchedule($schedule, $currentTime)
    {
        try {
            $times = json_decode($schedule->value, true);

            if (! is_array($times)) {
                return;
            }

            // Check if current time matches any scheduled time
            if (in_array($currentTime, $times)) {
                Log::info('EmailScheduleService: Executing Google fetch', [
                    'user_id' => $schedule->user_id,
                    'scheduled_time' => $currentTime,
                ]);

                // Execute Gmail fetch
                $this->executeGmailFetch($schedule->user_id);

                Log::info('EmailScheduleService: Completed Google fetch', [
                    'user_id' => $schedule->user_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('EmailScheduleService: Error processing Google schedule', [
                'user_id' => $schedule->user_id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Process Outlook email fetch schedule for a user
     */
    protected function processOutlookSchedule($schedule, $currentTime)
    {
        try {
            $times = json_decode($schedule->value, true);

            if (! is_array($times)) {
                return;
            }

            // Check if current time matches any scheduled time
            if (in_array($currentTime, $times)) {
                Log::info('EmailScheduleService: Executing Outlook fetch', [
                    'user_id' => $schedule->user_id,
                    'scheduled_time' => $currentTime,
                ]);

                // Execute Outlook fetch
                $this->executeOutlookFetch($schedule->user_id);

                Log::info('EmailScheduleService: Completed Outlook fetch', [
                    'user_id' => $schedule->user_id,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('EmailScheduleService: Error processing Outlook schedule', [
                'user_id' => $schedule->user_id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Execute Gmail fetch for a specific user
     * This is the same logic as EmailOperationsController::getGmail()
     */
    protected function executeGmailFetch($userId)
    {
        try {
            // Get user's Gmail credentials
            $gmailCredential = UserCredential::forUser($userId)
                ->forProvider('google')
                ->first();

            if (! $gmailCredential) {
                Log::error('EmailScheduleService: No Gmail connection', [
                    'user_id' => $userId,
                ]);

                return;
            }

            // Get a fresh, valid access token
            $validAccessToken = $this->googleOAuthService->getValidAccessToken($gmailCredential);

            if (! $validAccessToken) {
                Log::error('EmailScheduleService: Gmail token invalid', [
                    'user_id' => $userId,
                ]);

                return;
            }

            // Log the final token being sent to webhook
            Log::info('EmailScheduleService: Final token being sent to webhook', [
                'user_id' => $userId,
                'token_length' => strlen($validAccessToken),
                'token_prefix' => substr($validAccessToken, 0, 20).'...',
                'is_same_as_database' => $validAccessToken === $gmailCredential->provider_token,
            ]);

            // Get the last read timestamp for Gmail messages
            $lastReadAt = Message::where('user_id', $userId)
                ->where('source', 'gmail')
                ->latest('received_at')
                ->value('received_at');

            // Convert to Unix epoch (integer)
            $afterEpoch = $lastReadAt
                ? Carbon::parse($lastReadAt, 'UTC')->timestamp
                : Carbon::parse('2002-01-01 13:45:27', 'UTC')->timestamp;

            // Get user's folder settings
            $folderSettings = $this->getUserFolderSettings($userId);

            // Prepare base data for N8N webhook
            $baseData = [
                'user_id' => $userId,
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
                'sent_status' => 'sent',
                'draft_status' => 'draft',
            ];

            // Merge base data with folder settings
            $data = array_merge($baseData, $folderSettings);

            // Call Email Agent service
            $result = $this->emailAgentService->getGmail($data);

            if ($result['success']) {
                Log::info('EmailScheduleService: Gmail fetch successful', [
                    'user_id' => $userId,
                    'message' => $result['message'],
                ]);
            } else {
                Log::error('EmailScheduleService: Gmail fetch failed', [
                    'user_id' => $userId,
                    'message' => $result['message'],
                ]);
            }

        } catch (\Exception $e) {
            Log::error('EmailScheduleService: executeGmailFetch error', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
        }
    }

    /**
     * Execute Outlook fetch for a specific user
     * This is the same logic as EmailOperationsController::getOutlook()
     */
    protected function executeOutlookFetch($userId)
    {
        try {
            // Get user's Microsoft credentials
            $outlookCredential = UserCredential::forUser($userId)
                ->forProvider('microsoft')
                ->first();

            if (! $outlookCredential) {
                Log::error('EmailScheduleService: No Outlook connection', [
                    'user_id' => $userId,
                ]);

                return;
            }

            // Get a fresh, valid access token
            $validAccessToken = $this->microsoftOAuthService->getValidAccessToken($outlookCredential);

            if (! $validAccessToken) {
                Log::error('EmailScheduleService: Outlook token invalid', [
                    'user_id' => $userId,
                ]);

                return;
            }

            // Get the last read timestamp for Outlook messages
            $lastReadAt = Message::where('user_id', $userId)
                ->where('source', 'outlook')
                ->latest('received_at')
                ->value('received_at');

            // Convert to Unix epoch (integer)
            $afterEpoch = $lastReadAt
                ? Carbon::parse($lastReadAt, 'UTC')->timestamp
                : Carbon::parse('2002-01-01 13:45:27', 'UTC')->timestamp;

            // Get user's folder settings
            $folderSettings = $this->getUserFolderSettings($userId);

            // Prepare base data for N8N webhook
            $baseData = [
                'user_id' => $userId,
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
                'sent_status' => 'sent',
                'draft_status' => 'draft',
            ];

            // Merge base data with folder settings
            $data = array_merge($baseData, $folderSettings);

            // Call Email Agent service
            $result = $this->emailAgentService->getOutlook($data);

            if ($result['success']) {
                Log::info('EmailScheduleService: Outlook fetch successful', [
                    'user_id' => $userId,
                    'message' => $result['message'],
                ]);
            } else {
                Log::error('EmailScheduleService: Outlook fetch failed', [
                    'user_id' => $userId,
                    'message' => $result['message'],
                ]);
            }

        } catch (\Exception $e) {
            Log::error('EmailScheduleService: executeOutlookFetch error', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
        }
    }

    /**
     * Get user's folder settings with boolean values
     * Returns all folder settings as boolean (true/false)
     * If setting doesn't exist, returns false as default
     *
     * This is the same logic as EmailOperationsController::getUserFolderSettings()
     */
    protected function getUserFolderSettings($userId)
    {
        // Define all possible folders and actions
        $folders = ['spam', 'promotions', 'social', 'personal', 'clients', 'team', 'finance', 'hr', 'other'];
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
}
