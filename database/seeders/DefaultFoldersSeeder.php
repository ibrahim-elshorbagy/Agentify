<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Agent\EmailAgent\Folder;

class DefaultFoldersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

        // Create default folders for all existing users
        $users = User::all();

        foreach ($users as $user) {
            foreach ($defaultFolders as $folderData) {
                Folder::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'name' => $folderData['name']
                    ],
                    array_merge($folderData, ['user_id' => $user->id])
                );
            }
        }
    }
}
