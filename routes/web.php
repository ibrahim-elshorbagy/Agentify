<?php

use App\Http\Controllers\Api\Agents\AgentSettingsController;
use App\Http\Controllers\Api\Agents\ReportAgentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PreferencesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Site\OAuth\ProviderCallbackController;
use App\Http\Controllers\Site\OAuth\ProviderRedirectController;
use App\Http\Controllers\User\ConnectionsController;
use App\Http\Controllers\User\Settings\UserSettingsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



// OAuth Email Connection Routes (Authentication Required)
Route::middleware('auth')->group(function () {
  Route::get('/auth/{provider}/redirect', ProviderRedirectController::class)->name('auth.redirect');
  Route::get('/auth/{provider}/callback', ProviderCallbackController::class)->name('auth.callback');
});



Route::get('/', [HomeController::class, 'home'])->name('home');

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
  Route::post('/profile/image', [ProfileController::class, 'uploadProfileImage'])->name('profile.image.update');

  // OAuth Connections routes
  Route::prefix('connections')->group(function () {
    Route::get('/connect/{provider}', [ConnectionsController::class, 'connect'])->name('connections.connect');
    Route::delete('/disconnect/{provider}', [ConnectionsController::class, 'disconnect'])->name('connections.disconnect');
    Route::get('/test/{provider}', [ConnectionsController::class, 'testConnection'])->name('connections.test');
  });

  // User Settings routes
  Route::prefix('settings')->name('settings.')->group(function () {
    Route::get('/', [UserSettingsController::class, 'index'])->name('index');
    Route::post('/', [UserSettingsController::class, 'store'])->name('store');
    Route::put('/{setting}', [UserSettingsController::class, 'update'])->name('update');
    Route::delete('/{setting}', [UserSettingsController::class, 'destroy'])->name('destroy');
    Route::delete('/bulk/delete', [UserSettingsController::class, 'bulkDelete'])->name('bulk.delete');
  });

  // N8N Webhook trigger
  Route::post('/trigger-n8n', [AgentSettingsController::class, 'triggerN8nWebhook'])->name('n8n.trigger');

  // ReportAgent Webhook trigger
  Route::post('/trigger-report-agent', [ReportAgentController::class, 'triggerReportWebhook'])->name('report-agent.trigger');

});
// User preferences routes
Route::any('/locale', [PreferencesController::class, 'changeLocale'])->name('locale.change');

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/testHost.php';

// Agents
require __DIR__ . '/EmailAgent.php';
require __DIR__ . '/ReportsAgent.php';
require __DIR__ . '/HrAgent.php';
require __DIR__ . '/QNAAgent.php';
