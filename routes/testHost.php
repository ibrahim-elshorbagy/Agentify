<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/artisan/{command}/{key}', function ($command, $key) {
  // protect with secret key
  if ($key !== env('ARTISAN_KEY')) {
    abort(403, 'Unauthorized');
  }

  switch ($command) {
    // 🔹 Database
    case 'migrate':
      Artisan::call('migrate');
      return nl2br(Artisan::output());
    case 'migrate-fresh':
      Artisan::call('migrate:fresh');
      return nl2br(Artisan::output());
    case 'migrate-refresh':
      Artisan::call('migrate:refresh');
      return nl2br(Artisan::output());
    case 'migrate-refresh-seed':
      Artisan::call('migrate:refresh --seed');
      return nl2br(Artisan::output());
    case 'db-seed':
      Artisan::call('db:seed');
      return nl2br(Artisan::output());

    // 🔹 Cache & Config
    case 'cache-clear':
      Artisan::call('cache:clear');
      return nl2br(Artisan::output());
    case 'config-clear':
      Artisan::call('config:clear');
      return nl2br(Artisan::output());
    case 'route-clear':
      Artisan::call('route:clear');
      return nl2br(Artisan::output());
    case 'view-clear':
      Artisan::call('view:clear');
      return nl2br(Artisan::output());
    case 'optimize':
      Artisan::call('optimize');
      return nl2br(Artisan::output());
    case 'optimize-clear':
      Artisan::call('optimize:clear');
      return nl2br(Artisan::output());

    // 🔹 Storage
    case 'storage-link':
      Artisan::call('storage:link');
      return nl2br(Artisan::output());

    // 🔹 Queue
    case 'queue-work':
      Artisan::call('queue:work');
      return nl2br(Artisan::output());
    case 'queue-retry':
      Artisan::call('queue:retry all');
      return nl2br(Artisan::output());
    case 'queue-clear':
      Artisan::call('queue:clear');
      return nl2br(Artisan::output());

    default:
      return "Unknown command";
  }
});
