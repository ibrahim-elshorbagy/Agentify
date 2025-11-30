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
      'csrf_token' => csrf_token(),
      // 'translations' => fn () => __('website'),
      'available_locales' => ['en', 'ar'],
      'locale' => fn() => app()->getLocale(),

    ];
  }
  public function handle(Request $request, \Closure $next)
  {
    $response = parent::handle($request, $next);

    if ($request->header('X-Inertia')) {
      $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      $response->headers->set('Pragma', 'no-cache');
      $response->headers->set('Expires', '0');
    }

    return $response;
  }
}
