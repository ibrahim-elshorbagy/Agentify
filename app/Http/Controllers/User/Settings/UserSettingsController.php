<?php

namespace App\Http\Controllers\User\Settings;

use App\Http\Controllers\Controller;
use App\Models\User\UserSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserSettingsController extends Controller
{
  public function index(Request $request)
  {
    // Get all settings for the authenticated user
    $settings = UserSettings::where('user_id', $request->user()->id)
      ->where('name', 'auto')
      ->get();

    return inertia('User/Settings/Settings', [
      'settings' => [
        'data' => $settings
      ],
    ]);
  }

  public function update(Request $request)
  {
    $user = $request->user();

    // Define expected folders and actions
    $folders = ['spam', 'promotions', 'social', 'personal', 'clients', 'team', 'finance', 'hr', 'other'];
    // $actions = ['is_read', 'is_starred', 'is_bin', 'is_archived', 'write_a_draft', 'auto_sent'];
    $actions = ['is_read', 'is_starred', 'is_bin', 'is_archived'];

    // Build validation rules dynamically
    $rules = [];
    foreach ($folders as $folder) {
      foreach ($actions as $action) {
        $key = "folder_{$folder}_{$action}";
        $rules[$key] = ['required', 'boolean'];
      }
    }

    $validated = $request->validate($rules);

    DB::transaction(function () use ($validated, $user) {
      foreach ($validated as $key => $value) {
        UserSettings::updateOrCreate(
          [
            'user_id' => $user->id,
            'key' => $key,
          ],
          [
            'name' => 'auto',
            'value' => $value ? 'true' : 'false',
          ]
        );
      }
    });

    return back()
      ->with('title', __('website_response.settings_updated_title'))
      ->with('message', __('website_response.settings_updated_message'))
      ->with('status', 'success');
  }
}
