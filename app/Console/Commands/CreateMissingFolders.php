<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Agent\EmailAgent\Folder;
use Illuminate\Console\Command;

class CreateMissingFolders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'folders:create-missing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create default folders for users who don\'t have them';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating default folders for users without them...');

        $users = User::whereHas('roles', function ($query) {
            $query->where('name', 'user');
        })->whereDoesntHave('emailFolders')->get();

        $count = 0;
        foreach ($users as $user) {
            $this->createDefaultFolders($user);
            $count++;
            $this->info("Created folders for user: {$user->name} ({$user->email})");
        }

        $this->info("Created default folders for {$count} users.");
    }

    /**
     * Create default folders for a user
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
}
