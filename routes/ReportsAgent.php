<?php

use App\Http\Controllers\User\Agents\ReportAgent\ReportAgentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {

  // Report Agent Chat Routes
  Route::get('/report-agent/chat', [ReportAgentController::class, 'chat'])
    ->name('user.report-agent.chat');

  Route::get('/report-agent/chat/{conversation}', [ReportAgentController::class, 'showConversation'])
    ->name('user.report-agent.conversation.show');

  // File Management Routes
  Route::get('/report-agent/files', [ReportAgentController::class, 'files'])
    ->name('user.report-agent.files');

  Route::post('/report-agent/files/upload', [ReportAgentController::class, 'uploadFiles'])
    ->name('user.report-agent.files.upload');

  Route::put('/report-agent/files/{file}', [ReportAgentController::class, 'updateFile'])
    ->name('user.report-agent.files.update');

  Route::delete('/report-agent/files/{file}', [ReportAgentController::class, 'deleteFile'])
    ->name('user.report-agent.files.delete');

  // Conversation Management Routes
  Route::post('/report-agent/conversations', [ReportAgentController::class, 'createConversation'])
    ->name('user.report-agent.conversations.store');

  Route::put('/report-agent/conversations/{conversation}', [ReportAgentController::class, 'updateConversation'])
    ->name('user.report-agent.conversations.update');

  Route::delete('/report-agent/conversations/{conversation}', [ReportAgentController::class, 'deleteConversation'])
    ->name('user.report-agent.conversations.delete');

  // Message Routes
  Route::post('/report-agent/messages', [ReportAgentController::class, 'sendMessage'])
    ->name('user.report-agent.messages.send');

});
