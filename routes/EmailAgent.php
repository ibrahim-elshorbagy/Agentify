<?php

use App\Http\Controllers\User\Agents\EmailAgent\MessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware( ['auth','role:user'])->prefix('dashboard')->group(function () {

    // Inbox Emails
    Route::get('/email-agent/inbox', [MessageController::class, 'inbox'])->name(name: 'user.email-agent.inbox.emails');
    Route::get('/email-agent/bin', [MessageController::class, 'bin'])->name(name: 'user.email-agent.bin.emails');
    Route::get('/email-agent/spam', [MessageController::class, 'spam'])->name(name: 'user.email-agent.spam.emails');

    // Email actions
    Route::patch('/email-agent/toggle-star/{id}', [MessageController::class, 'toggleStar'])->name('user.email-agent.toggle-star');

    // View and respond to messages
    Route::get('/email-agent/view/{id}', [MessageController::class, 'view'])->name('user.email-agent.view');
    Route::post('/email-agent/response/{id}', [MessageController::class, 'storeResponse'])->name('user.email-agent.store-response');

});
