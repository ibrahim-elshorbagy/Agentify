<?php

namespace App\Http\Controllers\User\Settings;

use App\Http\Controllers\Controller;
use App\Models\User\UserSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserSettingsController extends Controller
{
  public function index(Request $request)
  {
    $request->validate([
      'search' => ['nullable', 'string', 'max:255'],
      'sort' => ['nullable', 'string'],
      'direction' => ['nullable', 'in:asc,desc'],
      'per_page' => ['nullable', 'integer', 'min:1'],
    ]);

    $sortField = $request->input('sort', 'id');
    $sortDirection = $request->input('direction', 'desc');
    $perPage = $request->input('per_page', 15);

    // Build query for user's settings
    $settingsQuery = UserSettings::query()
      ->where('user_id', $request->user()->id);

    // Apply search filter
    if ($request->filled('search')) {
      $search = $request->input('search');
      $settingsQuery->where(function ($query) use ($search) {
        $query->where('name', 'like', "%{$search}%")
              ->orWhere('key', 'like', "%{$search}%")
              ->orWhere('value', 'like', "%{$search}%");
      });
    }

    // Get paginated settings
    $settings = $settingsQuery->orderBy($sortField, $sortDirection)
      ->paginate($perPage)
      ->withQueryString();

    // Add row numbers
    $settings = $this->addRowNumbers($settings);

    return inertia('User/Settings/Settings', [
      'settings' => $settings,
      'queryParams' => $request->query() ?: null,
    ]);
  }

  public function store(Request $request)
  {
    $data = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'key' => ['required', 'string', 'max:255'],
      'value' => ['required', 'string'],
    ]);

    // Check if key already exists for this user
    $existingSetting = UserSettings::where('user_id', $request->user()->id)
      ->where('key', $data['key'])
      ->first();

    if ($existingSetting) {
      return back()->withErrors([
        'key' => __('website_response.setting_key_exists')
      ]);
    }

    UserSettings::create([
      'user_id' => $request->user()->id,
      'name' => $data['name'],
      'key' => $data['key'],
      'value' => $data['value'],
    ]);

    return back()
      ->with('title', __('website_response.setting_created_title'))
      ->with('message', __('website_response.setting_created_message'))
      ->with('status', 'success');
  }

  public function update(Request $request, UserSettings $setting)
  {
    // Ensure user can only update their own settings
    if ($setting->user_id !== $request->user()->id) {
      abort(403);
    }

    $data = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'key' => ['required', 'string', 'max:255'],
      'value' => ['required', 'string'],
    ]);

    // Check if key already exists for this user (excluding current setting)
    $existingSetting = UserSettings::where('user_id', $request->user()->id)
      ->where('key', $data['key'])
      ->where('id', '!=', $setting->id)
      ->first();

    if ($existingSetting) {
      return back()->withErrors([
        'key' => __('website_response.setting_key_exists')
      ]);
    }

    $setting->update($data);

    return back()
      ->with('title', __('website_response.setting_updated_title'))
      ->with('message', __('website_response.setting_updated_message'))
      ->with('status', 'success');
  }

  public function destroy(Request $request, UserSettings $setting)
  {
    // Ensure user can only delete their own settings
    if ($setting->user_id !== $request->user()->id) {
      abort(403);
    }

    $setting->delete();

    return back()
      ->with('title', __('website_response.setting_deleted_title'))
      ->with('message', __('website_response.setting_deleted_message'))
      ->with('status', 'success');
  }

  /**
   * Bulk delete settings
   */
  public function bulkDelete(Request $request)
  {
    $request->validate([
      'ids' => ['required', 'array'],
      'ids.*' => ['required', 'integer', 'exists:user_settings,id'],
    ]);

    // Only delete settings that belong to the authenticated user
    $deleted = UserSettings::whereIn('id', $request->ids)
      ->where('user_id', $request->user()->id)
      ->delete();

    return back()
      ->with('title', __('website_response.settings_deleted_title'))
      ->with('message', __('website_response.settings_deleted_message', ['count' => $deleted]))
      ->with('status', 'success');
  }

}
