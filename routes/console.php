<?php

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
        Log::info('EmailScheduleService: Starting scheduled email check...');
    })
    ->after(function () {
        Log::info('EmailScheduleService: Completed scheduled email check successfully.');
    })
    ->onFailure(function () {
        Log::error('EmailScheduleService: Scheduled email check failed.');
    })
    ->then(function () {
        Log::info('EmailScheduleService: Closed.');
    });
