<?php

use App\Http\Controllers\User\Agents\EmailAgentQNA\QNAController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {

  // QNA Agent Chat Routes
  Route::get('/qna-agent/chat', [QNAController::class, 'chat'])
    ->name('user.qna-agent.chat');

  Route::get('/qna-agent/chat/{conversation}', [QNAController::class, 'showConversation'])
    ->name('user.qna-agent.conversation.show');

  // Conversation Management Routes
  Route::post('/qna-agent/conversations', [QNAController::class, 'createConversation'])
    ->name('user.qna-agent.conversations.store');

  Route::put('/qna-agent/conversations/{conversation}', [QNAController::class, 'updateConversation'])
    ->name('user.qna-agent.conversations.update');

  Route::delete('/qna-agent/conversations/{conversation}', [QNAController::class, 'deleteConversation'])
    ->name('user.qna-agent.conversations.delete');

  // Message Routes
  Route::post('/qna-agent/messages', [QNAController::class, 'sendMessage'])
    ->name('user.qna-agent.messages.send');

});
