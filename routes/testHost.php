<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/artisan/{command}/{key}', function ($command, $key) {
  // protect with secret key
  if ($key !== env('ARTISAN_KEY')) {
    abort(403, 'Unauthorized');
  }

  switch ($command) {
    case 'migrate-refresh-seed':
      Artisan::call('migrate:refresh --seed');
      return nl2br(Artisan::output());
    case 'optimize':
      Artisan::call('optimize');
      return nl2br(Artisan::output());

    case 'optimize-clear':
      Artisan::call('optimize:clear');
      return nl2br(Artisan::output());

    case 'storage-link':
      Artisan::call('storage:link');
      return nl2br(Artisan::output());

    default:
      return "Unknown command";
  }
});
