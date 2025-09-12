<?php

use App\Http\Controllers\User\Agents\EmailAgent\MessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware( ['auth','role:user'])->prefix('dashboard')->group(function () {

    // Inbox Emails
    Route::get('/email-agent/inbox', [MessageController::class, 'inbox'])->name(name: 'user.email-agent.inbox.emails');

});
