<?php

use App\Http\Controllers\User\Agents\HrAgent\HrAgentController;
use App\Models\Agent\HrAgent\HrAgent;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {
    // HR Agent routes
    Route::get('/hr-agent', [HrAgentController::class, 'index'])->name('user.hr-agent.index');
    Route::get('/hr-agent/{hrAgent}', [HrAgentController::class, 'view'])->name('user.hr-agent.view');
    Route::delete('/hr-agent/delete/{hrAgent}', [HrAgentController::class, 'destroy'])->name('user.hr-agent.destroy');
    Route::delete('/hr-agent/bulk-delete', [HrAgentController::class, 'bulkDelete'])->name('user.hr-agent.bulk.delete');

    // HR Agent N8N Integration routes
    Route::post('/hr-agent/files/upload', [HrAgentController::class, 'uploadFiles'])->name('user.hr-agent.files.upload');
    Route::post('/hr-agent/get-gmail', [HrAgentController::class, 'getGmail'])->name('user.hr-agent.get-gmail');
    Route::post('/hr-agent/get-outlook', [HrAgentController::class, 'getOutlook'])->name('user.hr-agent.get-outlook');
});
