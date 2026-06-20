<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class MetricsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        $response = $next($request);

        $duration = (microtime(true) - $start) * 1000;

        try {
            
            if (!str_contains($request->path(), 'metrics')) {
                $this->trackRequest($request, $response, $duration);
            }
        } catch (\Exception $e) {
            Log::warning('Metrics tracking failed: ' . $e->getMessage());
        }

        return $response;
    }

    private function trackRequest(Request $request, Response $response, float $durationMs): void
    {
        
        Cache::increment('metrics:request_count');

        
        $count = Cache::get('metrics:request_count', 0);
        $currentAvg = Cache::get('metrics:avg_response_time_ms', 0);
        $newAvg = $currentAvg + ($durationMs - $currentAvg) / max(1, min($count, 1000));
        Cache::forever('metrics:avg_response_time_ms', round($newAvg, 2));

        
        Cache::increment('metrics:requests_by_method:' . strtolower($request->method()));

        
        $statusGroup = (int) ($response->getStatusCode() / 100) . 'xx';
        Cache::increment('metrics:requests_by_status:' . $statusGroup);
    }
}
