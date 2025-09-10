<?php

namespace App\Services\SubscriptionSystem;

use App\Models\SubscriptionSystem\Subscription;
use App\Models\SubscriptionSystem\Plan;
use App\Models\SubscriptionSystem\PlanFeature;
use App\Models\SubscriptionSystem\PlanFeatureUsage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{



  /**
   * Create a new subscription for a user
   *
   * @param int $userId
   * @param int $planId
   * @param string $type 'monthly'|'yearly'
   * @return Subscription
   */
  public function subscribe(int $userId, int $planId): Subscription
  {
    return DB::transaction(function () use ($userId, $planId) {
      $plan = Plan::findOrFail($planId);
      $type = $plan->type;
      
      $subscription = Subscription::create([
        'user_id' => $userId,
        'plan_id' => $planId,
        'type' => $type,
        'starts_at' => now(),
        'ends_at' => $type === 'monthly' ? now()->addMonth() : now()->addYear(),
        'status' => 'active',
      ]);

      // Create usages for the subscription based on plan features
      foreach ($plan->features as $feature) {
        PlanFeatureUsage::create([
          'subscription_id' => $subscription->id,
          'feature_id' => $feature->id,
          'used_value' => 0,
          'limit_value' => $feature->pivot->limit_value,
          'type' => $feature->type,
          'reset_date' => $this->calculateResetDate($subscription),
        ]);
      }

      return $subscription;
    });
  }

  /**
   * Calculate next reset date for yearly subscriptions
   *
   * @param Subscription $subscription
   * @return \Carbon\Carbon
   */
  private function calculateResetDate(Subscription $subscription): Carbon
  {
    return $subscription->type === 'yearly' ? now()->addMonth() : null;
  }

  /**
   * Increment usage for a feature
   *
   * @param Subscription $subscription
   * @param int $featureId
   * @param int $amount
   * @return PlanFeatureUsage
   */
  public function incrementCounter(Subscription $subscription, int $featureId, int $amount = 1): PlanFeatureUsage
  {
    $usage = $subscription->usages()->where('feature_id', $featureId)->where('type', 'counter')->firstOrFail();

    $usage->used_value += $amount;

    if ($usage->limit_value && $usage->used_value > $usage->limit_value) {
      $usage->used_value = $usage->limit_value;
    }

    $usage->save();

    return $usage;
  }

  /**
   * Adjust quota usage (can increase or decrease)
   *
   * @param Subscription $subscription
   * @param int $featureId
   * @param int $amount Positive to add, negative to subtract
   * @return PlanFeatureUsage
   */
  public function adjustQuota(Subscription $subscription, int $featureId, int $amount): PlanFeatureUsage
  {
    $usage = $subscription->usages()->where('feature_id', $featureId)->where('type', 'quota')->firstOrFail();

    $usage->used_value += $amount;

    // Ensure used_value doesn't exceed limit or go below 0
    if ($usage->limit_value && $usage->used_value > $usage->limit_value) {
      $usage->used_value = $usage->limit_value;
    }

    if ($usage->used_value < 0) {
      $usage->used_value = 0;
    }

    $usage->save();

    return $usage;
  }

  /**
   * Check if a feature can be consumed
   *
   * @param Subscription $subscription
   * @param int $featureId
   * @param int $amount
   * @return bool
   */
  public function canConsume(Subscription $subscription, int $featureId, int $amount = 1): bool
  {
    $usage = $subscription->usages()->where('feature_id', $featureId)->first();

    if (!$usage) {
      return false;
    }

    return !$usage->limit_value || ($usage->used_value + $amount <= $usage->limit_value);
  }


  /**
   * Check remaining usage for a feature
   *
   * @param Subscription $subscription
   * @param int $featureId
   * @return int|null
   */
  public function remainingUsage(Subscription $subscription, int $featureId): ?int
  {
    $usage = $subscription->usages()->where('feature_id', $featureId)->first();

    if (!$usage)
      return null;

    return $usage->limit_value ? $usage->limit_value - $usage->used_value : null;
  }


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
        'reset_date' => $this->calculateResetDate($usage->subscription),
      ]);
    }

    // Quota type is live; do not reset anything
  }



}
