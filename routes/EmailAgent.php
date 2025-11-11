<?php

use App\Http\Controllers\User\Agents\EmailAgent\MessageController;
use App\Http\Controllers\User\Agents\EmailAgent\ResponseMessageController;
use App\Http\Controllers\User\Agents\EmailAgent\EmailOperationsController;
use App\Models\Agent\EmailAgent\Message;
use App\Models\Agent\EmailAgent\MessageResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {

  // Unified Email Folders - with folder parameter
  Route::get('/email-agent/{folder}', [MessageController::class, 'emails'])
    ->name('user.email-agent.emails')
    ->where('folder', 'inbox|spam|bin|promotions|social|personal|clients|team|finance|hr|starred|archive|other');

  // Sent and Draft Emails - Response Messages
  Route::get('/email-agent/sent', [ResponseMessageController::class, 'sent'])
    ->name('user.email-agent.sent.emails');
  Route::get('/email-agent/draft', [ResponseMessageController::class, 'draft'])
    ->name('user.email-agent.draft.emails');


  Route::get('/email-agent/view/{message}', [MessageController::class, 'view'])
    ->name('user.email-agent.view')
    ->where('message', '[0-9]+');

  Route::post('/email-agent/response/{message}', [MessageController::class, 'storeResponse'])
    ->name('user.email-agent.store-response')
    ->where('message', '[0-9]+');

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

  Route::patch('/email-agent/bulk/archive', [MessageController::class, 'bulkArchive'])
    ->name('user.email-agent.bulk.archive');

  Route::patch('/email-agent/bulk/unarchive', [MessageController::class, 'bulkUnarchive'])
    ->name('user.email-agent.bulk.unarchive');

  Route::patch('/email-agent/bulk/update-folder/{folder}', [MessageController::class, 'bulkUpdateFolder'])
    ->name('user.email-agent.bulk.update-folder')
    ->where('folder', 'inbox|spam|promotions|social|personal|clients|team|finance|hr|starred|archive|other');

  Route::patch('/email-agent/bulk/move-to-bin', [MessageController::class, 'bulkMoveToBin'])
    ->name('user.email-agent.bulk.move-to-bin');

  Route::patch('/email-agent/bulk/restore-from-bin', [MessageController::class, 'bulkRestoreFromBin'])
    ->name('user.email-agent.bulk.restore-from-bin');

  Route::delete('/email-agent/bulk/delete-permanently', [MessageController::class, 'bulkDeletePermanently'])
    ->name('user.email-agent.bulk.delete-permanently');

  // START ---------------------------------------------------------------------------------------- Response Message
  // Bulk actions for response messages (sent/draft)
  Route::delete('/email-agent/response/bulk/delete-drafts', [ResponseMessageController::class, 'bulkDeleteDrafts'])
    ->name('user.email-agent.response.bulk.delete-drafts');

  Route::patch('/email-agent/response/bulk/send-drafts', [ResponseMessageController::class, 'bulkSendDrafts'])
    ->name('user.email-agent.response.bulk.send-drafts');

  Route::delete('/email-agent/response/bulk/delete-sent', [ResponseMessageController::class, 'bulkDeleteSent'])
    ->name('user.email-agent.response.bulk.delete-sent');

  // Email Operations - Get emails from Gmail and Outlook
  Route::post('/email-agent/get-gmail', [EmailOperationsController::class, 'getGmail'])
    ->name('user.email-agent.get-gmail');
  Route::post('/email-agent/get-outlook', [EmailOperationsController::class, 'getOutlook'])
    ->name('user.email-agent.get-outlook');

  // Email Schedule Settings
  Route::post('/email-agent/schedule/update', [EmailOperationsController::class, 'updateSchedule'])
    ->name('user.email-agent.schedule.update');
});
