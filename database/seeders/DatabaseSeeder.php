<?php

namespace Database\Seeders;

use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {



    $SystemAdminRole = Role::firstOrCreate(['name' => 'admin']);
    $userRole = Role::firstOrCreate(['name' => 'user']);

    $admin = User::create([
      'id' => 1,
      'name' => 'ibrahim elshorbagy',
      'username' => 'a',
      'email' => 'ibrahim.elshorbagy47@gmail.com',
      'password' => Hash::make('a'),
    ]);

    $admin->assignRole($SystemAdminRole);

    $user = User::create([
      'id' => 2,
      'name' => 'ibrahim elshorbagy',
      'username' => 'u',
      'email' => 'e.mohmed55@gmail.com',
      'password' => Hash::make('u'),
    ]);

    $user->assignRole($userRole);

    $this->call(SubscriptionSystemSeeder::class);

    // User::factory(100)->create();
    Message::factory()
    ->count(100)
    ->has(
        MessageResponse::factory()->count(2),
        'responses' // 👈 relationship in Message model
    )
    ->create();



  }
}
