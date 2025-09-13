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
    Route::patch('/email-agent/toggle-read/{id}', [MessageController::class, 'toggleRead'])->name('user.email-agent.toggle-read');
    Route::patch('/email-agent/move-to-spam/{id}', [MessageController::class, 'moveToSpam'])->name('user.email-agent.move-to-spam');
    Route::patch('/email-agent/move-to-bin/{id}', [MessageController::class, 'moveToBin'])->name('user.email-agent.move-to-bin');
    Route::patch('/email-agent/restore/{id}', [MessageController::class, 'restore'])->name('user.email-agent.restore');
    Route::delete('/email-agent/delete-permanently/{id}', [MessageController::class, 'deletePermanently'])->name('user.email-agent.delete-permanently');

    // View and respond to messages
    Route::get('/email-agent/view/{id}', [MessageController::class, 'view'])->name('user.email-agent.view');
    Route::post('/email-agent/response/{id}', [MessageController::class, 'storeResponse'])->name('user.email-agent.store-response');

    // Create and update messages
    Route::post('/email-agent/message', [MessageController::class, 'storeMessage'])->name('user.email-agent.store-message');
    Route::put('/email-agent/message/{id}', [MessageController::class, 'updateMessage'])->name('user.email-agent.update-message');

});
