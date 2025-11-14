<?php

namespace App\Services\SubscriptionSystem;

use App\Models\SubscriptionSystem\Subscription;
use App\Models\SubscriptionSystem\Plan;
use App\Models\SubscriptionSystem\PlanFeature;
use App\Models\SubscriptionSystem\PlanFeatureUsage;
use App\Models\User;
use App\Enums\FeatureEnum;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SubscriptionServiceJobs
{


  /**
   * Cron job to reset usages if reset_date has passed
   *
   * @return void
   */
  public function resetUsagesIfNeeded(): void
  {
    $today = now();

    // Only counter type usages have reset
    $usages = PlanFeatureUsage::where('type', 'counter')
      ->whereNotNull('reset_date')
      ->where('reset_date', '<=', $today)
      ->get();

    foreach ($usages as $usage) {
      $usage->update([
        'used_value' => 0,
        'reset_date' => $usage->subscription->type === 'yearly' ? now()->addMonth() : null,
      ]);
    }

    Log::info('Subscription Usage Reset ' . count($usages) . ' plan feature usages.');
  }

}
