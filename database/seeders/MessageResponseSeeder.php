<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Agent\EmailAgent\MessageResponse;

class MessageResponseSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        MessageResponse::factory()->count(20)->create();
    }
}
