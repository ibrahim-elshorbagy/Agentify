<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class PreferencesController extends Controller
{
  /**
   * Change the application locale.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\RedirectResponse
   */
  public function changeLocale(Request $request)
  {
    $data = $request->validate([
      'locale' => ['required', 'string', 'in:en,ar'],
    ]);

    // Store the locale in session
    $request->session()->put('locale', $data['locale']);

    // Set the application locale
    app()->setLocale($data['locale']);

    // Get translations for the newly selected locale
    $title = __('website_response.language_changed_title');
    $message = __('website_response.language_changed_message');

    return back()
      ->with('title', $title)
      ->with('message', $message)
      ->with('status', 'success')
      ->withCookie(cookie('locale', $data['locale'], 525600)); // Store in cookie for 1 year
  }
}
