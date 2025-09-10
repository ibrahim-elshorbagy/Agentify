<?php

namespace App\Models\SubscriptionSystem;

use Illuminate\Database\Eloquent\Model;

class PlanFeature extends Model
{
  protected $guarded = ['id'];

  public function plan()
  {
    return $this->belongsTo(Plan::class);
  }

  public function feature()
  {
    return $this->belongsTo(Feature::class);
  }
}
