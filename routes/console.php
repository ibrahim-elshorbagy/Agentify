<?php

use App\Services\SubscriptionSystem\SubscriptionServiceJobs;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schedule;

// Schedule the email fetch command to run every minute
Schedule::command('emails:fetch-scheduled')
  ->everyMinute()
  ->withoutOverlapping()
  ->runInBackground()
  ->before(function () {
    // Log::info('EmailScheduleService: Starting scheduled email check...');
  })
  ->after(function () {
    // Log::info('EmailScheduleService: Completed scheduled email check successfully.');
  })
  ->onFailure(function () {
    // Log::error('EmailScheduleService: Scheduled email check failed.');
  })
  ->then(function () {
    // Log::info('EmailScheduleService: Closed.');
  });


Schedule::call(function () {
  (new SubscriptionServiceJobs())->resetUsagesIfNeeded();
})
  ->dailyAt('00:00')
  ->name('reset-usages')
  ->withoutOverlapping()
  ->before(function () {
    Log::info('SubscriptionServiceJobs: Starting daily reset of usages...');
  })
  ->after(function () {
    Log::info('SubscriptionServiceJobs: Completed daily reset of usages successfully.');
  })
  ->onFailure(function () {
    Log::error('SubscriptionServiceJobs: Daily reset of usages failed.');
  })
  ->then(function () {
    Log::info('SubscriptionServiceJobs: Closed.');
  });
