<?php

use App\Http\Controllers\FinanceTrack\Wallet\WalletController;
use App\Http\Controllers\FinanceTrack\Task\TaskController;
use App\Http\Controllers\FinanceTrack\Task\TaskSourceController;
use App\Http\Controllers\FinanceTrack\Transactions\TransactionsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware( ['auth','role:user'])->group(function () {
  // Wallets CRUD
  Route::post('/dashboard/wallets', [WalletController::class, 'store'])->name('wallets.store');
  Route::get('/dashboard/wallets', [WalletController::class, 'index'])->name('wallets.index');
  Route::put('/dashboard/wallets/{wallet}', [WalletController::class, 'update'])->name('wallets.update');
  Route::delete('/dashboard/wallets/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');
  Route::delete('/dashboard/wallets-bulk', [WalletController::class, 'bulkDestroy'])->name('wallets.bulk-destroy');

  // Companies routes
  Route::get('/dashboard/task-sources', [TaskSourceController::class, 'index'])->name('task-sources.index');
  Route::post('/dashboard/task-sources', [TaskSourceController::class, 'store'])->name('task-sources.store');
  Route::put('/dashboard/task-sources/{taskSource}', [TaskSourceController::class, 'update'])->name('task-sources.update');
  Route::delete('/dashboard/task-sources/{taskSource}', [TaskSourceController::class, 'destroy'])->name('task-sources.destroy');
  Route::delete('/dashboard/task-sources-bulk', [TaskSourceController::class, 'bulkDestroy'])->name('task-sources.bulk-destroy');

  // Parent Tasks routes
  Route::get('/dashboard/task-sources/{taskSource}/tasks', [TaskController::class, 'index'])->name('tasks.index');
  Route::post('/dashboard/task-sources/{taskSource}/tasks', [TaskController::class, 'storeParent'])->name('tasks.store-parent');

  // Tasks routes
  Route::get('/dashboard/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
  Route::post('/dashboard/tasks/{parentTask}/child', [TaskController::class, 'storeChild'])->name('tasks.store-child');
  Route::put('/dashboard/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
  Route::delete('/dashboard/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
  Route::delete('/dashboard/tasks-bulk', [TaskController::class, 'bulkDestroy'])->name('tasks.bulk-destroy');

  // Task Status routes
  Route::get('/dashboard/tasks-active', [TaskController::class, 'activeTasks'])->name('tasks.active');
  Route::get('/dashboard/tasks-completed', [TaskController::class, 'completedTasks'])->name('tasks.completed');
  Route::put('/dashboard/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.update-status');

  // Transactions routes
  Route::get('/dashboard/transactions', [TransactionsController::class, 'index'])->name('transactions.index');
  Route::post('/dashboard/transactions', [TransactionsController::class, 'store'])->name('transactions.store');
  Route::put('/dashboard/transactions/{transaction}', [TransactionsController::class, 'update'])->name('transactions.update');
  Route::delete('/dashboard/transactions/{transaction}', [TransactionsController::class, 'destroy'])->name('transactions.destroy');
  Route::delete('/dashboard/transactions-bulk', [TransactionsController::class, 'bulkDestroy'])->name('transactions.bulk-destroy');
});
