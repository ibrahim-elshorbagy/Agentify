<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Agents\AgentSettingsController;


// Agent Settings API Routes
Route::prefix('agents')->middleware('n8n.auth')->group(function () {
    Route::get('/users', [AgentSettingsController::class, 'getAllUsers']);
    Route::get('/users/{userId}', [AgentSettingsController::class, 'getUser']);
});
