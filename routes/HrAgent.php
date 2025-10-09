<?php

use App\Http\Controllers\User\Agents\HrAgent\HrAgentController;
use App\Models\Agent\HrAgent\HrAgent;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {
    // HR Agent routes
    Route::get('/hr-agent', [HrAgentController::class, 'index'])->name('user.hr-agent.index');
    Route::get('/hr-agent/{hrAgent}', [HrAgentController::class, 'view'])->name('user.hr-agent.view');
    Route::delete('/hr-agent/bulk-delete', [HrAgentController::class, 'bulkDelete'])->name('user.hr-agent.bulk.delete');
});
