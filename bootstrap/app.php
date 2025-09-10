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
    commands: __DIR__ . '/../routes/console.php',
    health: '/up',
  )
  ->withMiddleware(function (Middleware $middleware): void {
    $middleware->web(append: [
      \App\Http\Middleware\HandleInertiaRequests::class,
      \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
    ]);
    $middleware->alias([
      'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
      'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,

    ]);
    //
  })
  ->withExceptions(function (Exceptions $exceptions): void {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
      $status = $response->getStatusCode();

      // In local or testing: show full Laravel debug page for real exceptions
      if (app()->environment(['local', 'testing']) && $status === 500) {
        return $response; // Let Laravel show Whoops / debug screen
      }

      // For known HTTP errors: render Inertia error page
      if (in_array($status, [500, 503, 404, 403, 401, 429, 419])) {
        $translations = trans('website');

        return Inertia::render('ErrorPage', [
          'status' => $status,
          'translations' => $translations,
        ])
          ->toResponse($request)
          ->setStatusCode($status);
      }

      // Default fallback
      return $response;
    });
  })->create();
