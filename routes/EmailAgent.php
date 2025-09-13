<?php

use App\Http\Controllers\User\Agents\EmailAgent\MessageController;
use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {

  // Inbox Emails -
  Route::get('/email-agent/inbox', [MessageController::class, 'inbox'])
    ->name('user.email-agent.inbox.emails');
  Route::get('/email-agent/bin', [MessageController::class, 'bin'])
    ->name('user.email-agent.bin.emails');
  Route::get('/email-agent/spam', [MessageController::class, 'spam'])
    ->name('user.email-agent.spam.emails');

  // Email actions - 
  Route::patch('/email-agent/toggle-star/{message}', [MessageController::class, 'toggleStar'])
    ->name('user.email-agent.toggle-star')
    ->where('message', '[0-9]+');

  Route::patch('/email-agent/toggle-read/{message}', [MessageController::class, 'toggleRead'])
    ->name('user.email-agent.toggle-read')
    ->where('message', '[0-9]+');

  Route::patch('/email-agent/move-to-spam/{message}', [MessageController::class, 'moveToSpam'])
    ->name('user.email-agent.move-to-spam')
    ->where('message', '[0-9]+');

  Route::patch('/email-agent/move-to-bin/{message}', [MessageController::class, 'moveToBin'])
    ->name('user.email-agent.move-to-bin')
    ->where('message', '[0-9]+');

  Route::patch('/email-agent/restore/{message}', [MessageController::class, 'restore'])
    ->name('user.email-agent.restore')
    ->where('message', '[0-9]+');

  Route::delete('/email-agent/delete-permanently/{message}', [MessageController::class, 'deletePermanently'])
    ->name('user.email-agent.delete-permanently')
    ->where('message', '[0-9]+');

  // View and respond to messages - with model binding
  Route::get('/email-agent/view/{message}', [MessageController::class, 'view'])
    ->name('user.email-agent.view')
    ->where('message', '[0-9]+');

  Route::post('/email-agent/response/{message}', [MessageController::class, 'storeResponse'])
    ->name('user.email-agent.store-response')
    ->where('message', '[0-9]+');

  // Create and update messages - with validation
  Route::post('/email-agent/message', [MessageController::class, 'storeMessage'])
    ->name('user.email-agent.store-message');

  Route::put('/email-agent/message/{messageResponse}', [MessageController::class, 'updateMessage'])
    ->name('user.email-agent.update-message')
    ->where('messageResponse', '[0-9]+');

  Route::patch('/email-agent/bulk/mark-read', [MessageController::class, 'bulkMarkAsRead'])
    ->name('user.email-agent.bulk.mark-read');

  Route::patch('/email-agent/bulk/mark-unread', [MessageController::class, 'bulkMarkAsUnread'])
    ->name('user.email-agent.bulk.mark-unread');

  Route::patch('/email-agent/bulk/star', [MessageController::class, 'bulkStar'])
    ->name('user.email-agent.bulk.star');

  Route::patch('/email-agent/bulk/unstar', [MessageController::class, 'bulkUnstar'])
    ->name('user.email-agent.bulk.unstar');

  Route::patch('/email-agent/bulk/move-to-spam', [MessageController::class, 'bulkMoveToSpam'])
    ->name('user.email-agent.bulk.move-to-spam');

  Route::patch('/email-agent/bulk/move-to-bin', [MessageController::class, 'bulkMoveToBin'])
    ->name('user.email-agent.bulk.move-to-bin');

  Route::patch('/email-agent/bulk/restore', [MessageController::class, 'bulkRestore'])
    ->name('user.email-agent.bulk.restore');

  Route::delete('/email-agent/bulk/delete-permanently', [MessageController::class, 'bulkDeletePermanently'])
    ->name('user.email-agent.bulk.delete-permanently');

});
