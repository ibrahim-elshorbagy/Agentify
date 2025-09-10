<?php

namespace App\Models\SubscriptionSystem;

use Illuminate\Database\Eloquent\Model;

class PlanFeatureUsage extends Model
{
  protected $guarded = ['id'];

  public function subscription()
  {
    return $this->belongsTo(Subscription::class);
  }

  public function feature()
  {
    return $this->belongsTo(Feature::class);
  }
}
