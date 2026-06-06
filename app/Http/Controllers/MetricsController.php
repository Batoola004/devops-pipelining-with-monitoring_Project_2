<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class MetricsController extends Controller
{
    
    public function __invoke(Request $request)
    {
        $metrics = [];

        
        $metrics[] = '# HELP laravel_app_info Application metadata';
        $metrics[] = '# TYPE laravel_app_info gauge';
        $metrics[] = 'laravel_app_info{version="' . app()->version() . '",env="' . app()->environment() . '"} 1';

        
        $serverStart = Cache::get('metrics:server_start_time', time());
        $uptime = time() - $serverStart;
        $metrics[] = '# HELP laravel_app_uptime_seconds Application uptime in seconds';
        $metrics[] = '# TYPE laravel_app_uptime_seconds gauge';
        $metrics[] = "laravel_app_uptime_seconds {$uptime}";

        
        $metrics[] = '# HELP laravel_app_memory_bytes Current PHP memory usage';
        $metrics[] = '# TYPE laravel_app_memory_bytes gauge';
        $metrics[] = 'laravel_app_memory_bytes ' . memory_get_usage(true);

        
        try {
            $dbConnection = DB::connection()->getDatabaseName();
            $dbHealthy = 1;
        } catch (\Exception $e) {
            $dbConnection = 'error';
            $dbHealthy = 0;
        }
        $metrics[] = '# HELP laravel_app_database_up Database connection status (1 = up, 0 = down)';
        $metrics[] = '# TYPE laravel_app_database_up gauge';
        $metrics[] = "laravel_app_database_up{driver=\"" . config('database.default') . "\",database=\"{$dbConnection}\"} {$dbHealthy}";

        
        $metrics[] = '# HELP laravel_app_cache_store Cache store in use';
        $metrics[] = '# TYPE laravel_app_cache_store gauge';
        $metrics[] = 'laravel_app_cache_store{driver="' . config('cache.default') . '"} 1';

        
        $requestCount = Cache::get('metrics:request_count', 0);
        $metrics[] = '# HELP laravel_app_requests_total Total request count (approximate)';
        $metrics[] = '# TYPE laravel_app_requests_total counter';
        $metrics[] = "laravel_app_requests_total {$requestCount}";

        
        $avgResponseTime = Cache::get('metrics:avg_response_time_ms', 0);
        $metrics[] = '# HELP laravel_app_response_time_ms Average response time in milliseconds';
        $metrics[] = '# TYPE laravel_app_response_time_ms gauge';
        $metrics[] = "laravel_app_response_time_ms {$avgResponseTime}";

        
        $metrics[] = '# HELP laravel_app_queue_connection Queue connection in use';
        $metrics[] = '# TYPE laravel_app_queue_connection gauge';
        $metrics[] = 'laravel_app_queue_connection{driver="' . config('queue.default') . '"} 1';

        
        $diskFree = disk_free_space(storage_path());
        $diskTotal = disk_total_space(storage_path());
        $diskUsedPercent = $diskTotal > 0 ? round((1 - $diskFree / $diskTotal) * 100, 2) : 0;
        $metrics[] = '# HELP laravel_app_storage_used_percent Storage disk usage percentage';
        $metrics[] = '# TYPE laravel_app_storage_used_percent gauge';
        $metrics[] = "laravel_app_storage_used_percent {$diskUsedPercent}";

        return response(implode("\n", $metrics) . "\n", 200)
            ->header('Content-Type', 'text/plain; charset=utf-8');
    }
}
