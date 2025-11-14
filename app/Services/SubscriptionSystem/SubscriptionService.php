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
          'reset_date' => $subscription->type === 'yearly' ? now()->addMonth() : null, //Important for yearly subscriptions
        ]);
      }

      return $subscription;
    });
  }

  /**
   * Check if a user can use a feature
   *
   * @param User $user
   * @param int $featureId
   * @param int $amount
   * @return array|null
   */
  public static function canUse(User $user, int $featureId, int $amount = 1): ?array
  {
    $subscription = $user->subscription;

    if (!$subscription) {
      return [
        'title' => __('website_response.subscription_not_found_title'),
        'message' => __('website_response.subscription_not_found_message'),
        'status' => 'error',
      ];
    }

    $usage = $subscription->usages()->where('feature_id', $featureId)->first();

    if (!$usage) {
      return [
        'title' => __('website_response.feature_not_found_title'),
        'message' => __('website_response.feature_not_found_message'),
        'status' => 'error',
      ];
    }

    if (!$usage->limit_value || $usage->used_value + $amount <= $usage->limit_value) {
      return null; // can use
    } else {
      return [
        'title' => __('website_response.feature_limit_exceeded_title'),
        'message' => __('website_response.feature_limit_exceeded_message'),
        'status' => 'error',
      ];
    }
  }


  /**
   * Increment usage for a feature (static method for easy controller usage)
   *
   * @param User $user
   * @param int $featureId
   * @param int $amount
   * @return PlanFeatureUsage
   */
  public static function incrementUsage(User $user, int $featureId, int $amount = 1): PlanFeatureUsage
  {
    $subscription = $user->subscription;

    if (!$subscription) {
      throw new \Exception('User has no active subscription');
    }

    $usage = $subscription->usages()->where('feature_id', $featureId)->where('type', 'counter')->first();

    if (!$usage) {
      throw new \Exception('Feature usage not found for this subscription');
    }

    $usage->used_value += $amount;

    $usage->save();

    return $usage;
  }

}
