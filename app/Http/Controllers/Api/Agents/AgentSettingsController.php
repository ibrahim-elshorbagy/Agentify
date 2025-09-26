<?php

namespace App\Http\Controllers\Api\Agents;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\User\UserSettings;
use App\Services\N8nWebhookService;
use Illuminate\Http\Request;

class AgentSettingsController extends Controller
{
    /**
     * Get all users with their settings as key-value pairs
     */
    public function getAllUsers()
    {
        $users = User::with(['roles', 'userSettings'])->get();

        $usersData = $users->map(function ($user) {
            $userData = [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                // 'username' => $user->username,
                // 'role' => $user->roles->first()?->name ?? 'user',
            ];

            // Add each setting as key => value
            foreach ($user->userSettings as $setting) {
                $userData[$setting->key] = $setting->value;
            }

            return $userData;
        });

        return response()->json($usersData);
    }

    /**
     * Get specific user with their settings as key-value pairs
     */
    public function getUser($userId)
    {
        $user = User::with(['roles', 'userSettings'])->find($userId);

        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        $userData = [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            // 'username' => $user->username,
            // 'role' => $user->roles->first()?->name ?? 'user',
        ];

        // Add each setting as key => value
        foreach ($user->userSettings as $setting) {
            $userData[$setting->key] = $setting->value;
        }

        return response()->json($userData);
    }

    /**
     * Trigger n8n webhook for agent processing
     */
    public function triggerN8nWebhook(Request $request)
    {
        $webhookService = new N8nWebhookService();

        // Prepare data to send to n8n
        $user = $request->user();
        $data = [
            'trigger_source' => 'laravel_dashboard',
            'timestamp' => now()->toISOString(),
            'user_id' => $user ? $user->id : null,
            'user_email' => $user ? $user->email : null,
            'custom_data' => $request->input('data', [])
        ];

        $result = $webhookService->triggerWebhook($data);

        if ($result['success']) {
            return back()
                ->with('title', 'N8N Webhook Success')
                ->with('message', 'N8N workflow has been triggered successfully!')
                ->with('status', 'success')
                ->with('webhookResponse', $result);
        } else {
            return back()
                ->with('title', 'N8N Webhook Error')
                ->with('message', 'Failed to trigger N8N webhook: ' . ($result['error'] ?? 'Unknown error'))
                ->with('status', 'error')
                ->with('webhookResponse', $result);
        }
    }


}
