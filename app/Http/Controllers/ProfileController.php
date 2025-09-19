<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
  /**
   * Display the user's profile form.
   */
  public function edit(Request $request): Response
  {
    return Inertia::render('Profile/Edit', [
      'mustVerifyEmail' => true,
      'status' => session('status'),
    ]);
  }

  /**
   * Update the user's profile information.
   */
  public function update(ProfileUpdateRequest $request): RedirectResponse
  {

    $user = Auth::user();
    $validated = $request->validated();

    $user->name = $validated['name'];
    $user->username = $validated['username'];
    if ($user->email !== $validated['email']) {
      $user->email = $validated['email'];
      $user->email_verified_at = null;
    }

    $user->save();

    return Redirect::route('profile.edit')
      ->with('title', __('website_response.profile_updated_title'))
      ->with('message', __('website_response.profile_updated_message'))
      ->with('status', 'success');
  }

  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/')
      ->with('title', __('website_response.account_deleted_title'))
      ->with('message', __('website_response.account_deleted_message'))
      ->with('status', 'warning');
  }

  public function uploadProfileImage(Request $request)
  {

    $request->validate([
      'image' => 'required|image|max:4096',
    ]);

    $user = $request->user();

    // Delete old image if exists
    if ($user->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $user->image_url))) {
      Storage::disk('public')->delete(str_replace('/storage/', '', $user->image_url));
    }

    $path = $request->file('image')->store($user->id . '/profile-images', 'public');

    $user->image_url = '/storage/' . $path;
    $user->save();

    return Redirect::route('profile.edit')
      ->with('title', __('website_response.profile_image_updated_title'))
      ->with('message', __('website_response.profile_image_updated_message'))
      ->with('status', 'success');
  }
}
