<?php

namespace App\Console\Commands;

use App\Services\Agents\EmailAgent\EmailScheduleService;
use Illuminate\Console\Command;

class FetchScheduledEmailsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:fetch-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch emails for users based on their scheduled times';

    /**
     * The email schedule service instance.
     *
     * @var EmailScheduleService
     */
    protected $scheduleService;

    /**
     * Create a new command instance.
     */
    public function __construct(EmailScheduleService $scheduleService)
    {
        parent::__construct();
        $this->scheduleService = $scheduleService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Starting scheduled email fetch process...');

        $this->scheduleService->checkAndExecuteScheduledFetches();

        $this->info('Scheduled email fetch process completed.');

        return Command::SUCCESS;
    }
}
