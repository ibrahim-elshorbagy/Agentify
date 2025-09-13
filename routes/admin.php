<?php

use App\Http\Controllers\Admin\Management\UserManagementController;
use App\Http\Controllers\Admin\SubscriptionSystem\PlansController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware( ['auth','role:admin'])->group(function () {
    // User Management routes
    Route::get('/admin/users', [UserManagementController::class, 'index'])->name('admin.users.index');
    Route::post('/admin/users', [UserManagementController::class, 'store'])->name('admin.users.store');
    Route::put('/admin/users/{user}', [UserManagementController::class, 'update'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');

    // User Management bulk actions
    Route::patch('/admin/users/bulk/block', [UserManagementController::class, 'bulkBlock'])->name('admin.users.bulk.block');
    Route::patch('/admin/users/bulk/unblock', [UserManagementController::class, 'bulkUnblock'])->name('admin.users.bulk.unblock');
    Route::delete('/admin/users/bulk/delete', [UserManagementController::class, 'bulkDelete'])->name('admin.users.bulk.delete');

    // Plans Management routes
    Route::get('/admin/plans', [PlansController::class, 'index'])->name('admin.plans.index');
    Route::get('/admin/plans/{plan}/edit', [PlansController::class, 'edit'])->name('admin.plans.edit');
    Route::put('/admin/plans/{plan}', [PlansController::class, 'update'])->name('admin.plans.update');
});
