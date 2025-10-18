<?php

namespace App\Observers;

use App\Models\User;
use App\Models\Agent\EmailAgent\Folder;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        // Create default folders for all new users
        // We'll check roles in the updated method as well since roles might be assigned after user creation
        $this->createDefaultFolders($user);
    }

    /**
     * Create default folders for a new user
     */
    private function createDefaultFolders(User $user): void
    {
        $defaultFolders = [
            [
                'name' => 'inbox',
                'icon' => 'fa-inbox',
                'is_default' => true,
                'sort_order' => 1
            ],
            [
                'name' => 'spam',
                'icon' => 'fa-exclamation-circle',
                'is_default' => true,
                'sort_order' => 2
            ],
            [
                'name' => 'bin',
                'icon' => 'fa-trash',
                'is_default' => true,
                'sort_order' => 3
            ]
        ];

        foreach ($defaultFolders as $folderData) {
            Folder::create(array_merge($folderData, ['user_id' => $user->id]));
        }
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        // If user was just assigned the 'user' role and doesn't have folders yet, create them
        if ($user->hasRole('user') && $user->emailFolders()->count() === 0) {
            $this->createDefaultFolders($user);
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        //
    }

    /**
     * Handle the User "restored" event.
     */
    public function restored(User $user): void
    {
        //
    }

    /**
     * Handle the User "force deleted" event.
     */
    public function forceDeleted(User $user): void
    {
        //
    }
}
