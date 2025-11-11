<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register console commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Console\Commands\FetchScheduledEmailsCommand::class,
            ]);
        }

        // Register EmailScheduleService
        $this->app->singleton(\App\Services\Agents\EmailAgent\EmailScheduleService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Increase maximum execution time to 5 minutes
        ini_set('max_execution_time', 600000);
    }
}
