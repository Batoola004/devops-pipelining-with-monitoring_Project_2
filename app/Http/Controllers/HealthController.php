<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    public function __invoke(Request $request)
    {
        $status = 200;
        $data = [
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'app' => config('app.name'),
            'env' => config('app.env'),
        ];

        // Check database connectivity
        try {
            DB::connection()->getPdo();
            $data['database'] = 'connected';
        } catch (\Exception $e) {
            $data['database'] = 'error: ' . $e->getMessage();
            $status = 503;
        }

        // Check cache connectivity
        try {
            Cache::store(config('cache.default'))->get('health-check-test');
            $data['cache'] = 'connected';
        } catch (\Exception $e) {
            $data['cache'] = 'error: ' . $e->getMessage();
            $status = 503;
        }

        return response()->json($data, $status);
    }
}
