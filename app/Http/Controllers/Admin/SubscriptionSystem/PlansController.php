<?php

namespace App\Http\Controllers\Admin\SubscriptionSystem;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionSystem\Plan;
use App\Models\SubscriptionSystem\Feature;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use App\Rules\FeatureLimitValue;

class PlansController extends Controller
{
  public function index(Request $request)
  {
    $request->validate([
      'name' => ['nullable', 'string', 'max:255'],
      'sort' => ['nullable', 'string', 'in:id,price,type,created_at'],
      'direction' => ['nullable', 'string', 'in:asc,desc'],
      'per_page' => ['nullable', 'integer', 'min:1'],
    ]);

    $sortField = $request->input('sort', 'id');
    $sortDirection = $request->input('direction', 'desc');
    $perPage = $request->input('per_page', 15);

    // Shared filter function
    $applyFilters = function ($query) use ($request) {
      if ($request->filled('name')) {
        $locale = app()->getLocale();
        $query->where("name->{$locale}", 'like', '%' . $request->name . '%')
          ->orWhere("name->en", 'like', '%' . $request->name . '%');
      }
    };

    // Monthly Plans
    $monthlyQuery = Plan::query()->with('features')->where('type', 'monthly');
    $applyFilters($monthlyQuery);
    $monthlyPlans = $monthlyQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'monthly_page')
      ->withQueryString();

    // Yearly Plans
    $yearlyQuery = Plan::query()->with('features')->where('type', 'yearly');
    $applyFilters($yearlyQuery);
    $yearlyPlans = $yearlyQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage, ['*'], 'yearly_page')
      ->withQueryString();

    // Features for dropdown in modals
    $features = Feature::all();

    return inertia('Admin/SubscriptionSystem/Plans/Plans', [
      'monthlyPlans' => $monthlyPlans,
      'yearlyPlans' => $yearlyPlans,
      'features' => $features,
      'queryParams' => $request->query() ?: null,
    ]);
  }



  public function edit(Plan $plan)
  {
    $plan->load('features');
    $features = Feature::all();

    return inertia('Admin/SubscriptionSystem/Plans/Partials/Pages/EditPlan', [
      'plan' => $plan,
      'features' => $features,
    ]);
  }

  public function update(Request $request, Plan $plan)
  {
    // Basic validation
    $basicValidation = $request->validate([
      'price' => ['required', 'numeric', 'min:0'],
      'features' => ['array'],
      'features.*.id' => ['required', 'exists:features,id'],
      'features.*.limit_value' => ['nullable'],
      'features.*.active' => ['required', 'boolean'],
    ]);

    // Update the plan
    $plan->update([
      'price' => $basicValidation['price'],
    ]);

    // Handle features with active status
    if (isset($basicValidation['features'])) {
      $syncData = [];

      // Get all features to check which ones should be included
      $allFeatures = Feature::all();

      foreach ($basicValidation['features'] as $feature) {
        $syncData[$feature['id']] = [
          'limit_value' => $feature['limit_value'],
          'active' => $feature['active'],
        ];
      }

      // For features not in the request but should be inactive, add them with active = false
      $requestFeatureIds = collect($basicValidation['features'])->pluck('id')->toArray();
      $missingFeatures = $allFeatures->whereNotIn('id', $requestFeatureIds);

      foreach ($missingFeatures as $missingFeature) {
        // Only add if it was previously attached to the plan
        if ($plan->features->contains('id', $missingFeature->id)) {
          $syncData[$missingFeature->id] = [
            'limit_value' => $missingFeature->type === 'boolean' ? 0 : null,
            'active' => false,
          ];
        }
      }

      $plan->features()->sync($syncData);
    }

    return back()
      ->with('title', __('website_response.plan_updated_title'))
      ->with('message', __('website_response.plan_updated_message'))
      ->with('status', 'success');
  }


}
