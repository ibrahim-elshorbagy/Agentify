<?php

namespace App\Http\Controllers\Api\Agents;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\User\UserSettings;
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
}
