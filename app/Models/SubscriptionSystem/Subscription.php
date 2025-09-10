<?php

namespace App\Models\SubscriptionSystem;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
  protected $guarded = ['id'];

  public function plan()
  {
    return $this->belongsTo(Plan::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function usages()
  {
    return $this->hasMany(PlanFeatureUsage::class);
  }
}
