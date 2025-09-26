<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class N8nApiAuth
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key') ?: $request->query('api_key');
        $validApiKey = config('services.n8n.api_key');

        if (!$apiKey || $apiKey !== $validApiKey) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid API key'
            ], 401);
        }

        return $next($request);
    }
}