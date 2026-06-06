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
            $this->trackRequest($duration);
        }

        return $response;
    }

    private function trackRequest(float $durationMs): void
    {
        
        Cache::increment('metrics:request_count');

        
        $count = Cache::get('metrics:request_count', 0);
        $currentAvg = Cache::get('metrics:avg_response_time_ms', 0);

        
        $newAvg = $currentAvg + ($durationMs - $currentAvg) / min($count, 1000);

        Cache::forever('metrics:avg_response_time_ms', round($newAvg, 2));
    }
}
