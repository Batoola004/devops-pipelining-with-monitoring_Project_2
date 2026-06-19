<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class MetricsMiddleware
{
    
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = (microtime(true) - $start) * 1000;

        
        if (! str_contains($request->path(), 'metrics')) {
            $this->trackRequest($request, $response, $duration);
        }

        return $response;
    }

    private function trackRequest(Request $request, Response $response, float $durationMs): void
    {
        
        Cache::increment('metrics:request_count');

        
        $count = Cache::get('metrics:request_count', 0);
        $currentAvg = Cache::get('metrics:avg_response_time_ms', 0);

        if ($count > 0) {
            $newAvg = $currentAvg + ($durationMs - $currentAvg) / min($count, 1000);
        } else {
            $newAvg = $durationMs;
        }
        Cache::forever('metrics:avg_response_time_ms', round($newAvg, 2));

        
        $method = strtolower($request->method());
        Cache::increment('metrics:requests_by_method:' . $method);

        
        $statusCode = $response->getStatusCode();
        $statusGroup = (int)($statusCode / 100) . 'xx';
        Cache::increment('metrics:requests_by_status:' . $statusGroup);

    }
}
