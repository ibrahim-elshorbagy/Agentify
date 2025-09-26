<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
  ->withRouting(
    web: __DIR__ . '/../routes/web.php',
    api: __DIR__ . '/../routes/api.php',
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO);

    $middleware->web(append: [
      \App\Http\Middleware\SetLocale::class,
      \App\Http\Middleware\HandleInertiaRequests::class,
      \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);

    // EXCLUDE locale cookie from encryption
    $middleware->encryptCookies(except: [
      'locale',
    ]);

    $middleware->alias([
      'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
      'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
      'n8n.auth' => \App\Http\Middleware\N8nApiAuth::class,
    ]);
  })
  ->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
      $status = $response->getStatusCode();

      if (app()->environment(['local', 'testing']) && $status === 500) {
        return $response;
      }

      if (in_array($status, [500, 503, 404, 403, 401, 429, 419])) {
        // Now this will work - cookie is unencrypted
        $locale = $request->cookie('locale', 'en');
        if (in_array($locale, ['en', 'ar'])) {
          app()->setLocale($locale);
        }

        Inertia::share('translations', trans('website'));
        Inertia::share('locale', app()->getLocale());

        return Inertia::render('ErrorPage', [
          'status' => $status,
        ])
          ->toResponse($request)
          ->setStatusCode($status);
      }

      return $response;
    });
  })
  ->create();
