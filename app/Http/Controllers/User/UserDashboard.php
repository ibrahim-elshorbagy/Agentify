<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionSystem\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\FeatureEnum;

class UserDashboard extends Controller
{
  public function subscription(){
    $user = Auth::user();
    $subscription = $user->subscription;

    if (!$subscription) {
      return inertia('User/Dashboard/Subscription', [
        'subscription' => null,
        'plan' => null,
        'usages' => [],
      ]);
    }

    $plan = $subscription->plan;
    $usages = $subscription->usages()->with('feature')->get();

    return inertia('User/Dashboard/Subscription', [
      'subscription' => $subscription,
      'plan' => $plan,
      'usages' => $usages,
    ]);
  }

  public function dashboard() {
    $user = Auth::user();
    if ($user->hasRole('admin')) {
      return redirect()->route('admin.users.index');
    } else {
      return redirect()->route('user.subscription');
    }
  }
}
