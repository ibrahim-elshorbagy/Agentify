<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): ?string
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */
  public function share(Request $request): array
  {
    return [
      ...parent::share($request),
      'auth' => [
        'user' => $request->user(),
        'roles' => $request->user()?->getRoleNames(),
        'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
      ],
      'flash' => [
        'title' => session('title'),
        'message' => session('message'),
        'status' => session('status'), //success / error / warning
        'type' => session('type'),
        'webhookResponse' => session('webhookResponse'),
        'emailData' => session('emailData'), // For email test modal
        'showEmailModal' => session('showEmailModal'), // Flag to show modal
      ],
      'impersonate_admin_id' => session('impersonate_admin_id'),

      'translations' => fn () => [
        'website' => __('website'),
        'website_response' => __('website_response'),
      ],
      'available_locales' => ['en', 'ar'],
      'locale' => fn () => app()->getLocale(),

      // User folders for email agent (only for users, not admins)
      'folders' => function () use ($request) {
        if ($request->user() && $request->user()->hasRole('user')) {
          return $request->user()->emailFolders()->ordered()->get();
        }
        return [];
      },

    ];
  }
}
