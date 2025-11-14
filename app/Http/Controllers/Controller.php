<?php

namespace App\Http\Controllers;

use App\Enums\FeatureEnum;
use App\Services\SubscriptionSystem\SubscriptionService;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
  protected function addRowNumbers($paginatedCollection)
  {
    $paginatedCollection->getCollection()->transform(function ($item, $key) use ($paginatedCollection) {
      $item->row_number = ($paginatedCollection->perPage() * ($paginatedCollection->currentPage() - 1)) + $key + 1;
      return $item;
    });

    return $paginatedCollection;
  }

  protected function checkFeatureAccess(FeatureEnum|int $feature, int $amount = 1) {
    $user = Auth::user();
    $featureId = is_int($feature) ? $feature : $feature->value;
    if ($error = SubscriptionService::canUse($user, $featureId, $amount)) {
        return back()->with($error);
    }
    return null;
  }

  protected function incrementFeatureUsage(FeatureEnum|int $feature, int $amount = 1) {
    $user = Auth::user();
    $featureId = is_int($feature) ? $feature : $feature->value;
    return SubscriptionService::incrementUsage($user, $featureId, $amount);
  }
  
}
