<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionSystem\Plan;
use App\Models\SubscriptionSystem\Feature;

class HomeController extends Controller
{
  public function home()
  {
    // Get all plans with their features
    $plans = Plan::with('features')->get();

    return inertia("Frontend/Home/Home", [
      'plans' => $plans,
    ]);
  }

  public function privacyPolicy()
  {
    return inertia("Frontend/Policy/PrivacyPolicy");
  }

  public function termsOfService()
  {
    return inertia("Frontend/Policy/Terms");
  }
}
