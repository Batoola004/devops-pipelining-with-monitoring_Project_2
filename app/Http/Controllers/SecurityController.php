<?php

namespace App\Http\Controllers;

use App\Services\ServerSecurityAnalyzerService;
use Illuminate\Support\Facades\Http;

class SecurityController extends Controller
{
    public function checkStatus(ServerSecurityAnalyzerService $analyzer)
    {
        try {
            $metricsData = [];

            
            
            $networkResponse = Http::timeout(5)->get('http://prometheus:9090/api/v1/query', [
                'query' => 'sum(rate(container_network_receive_bytes_total[1m])) by (name)'
            ]);
            
            if ($networkResponse->successful()) {
                $metricsData['Network_Traffic_Bytes_Per_Second'] = $networkResponse->json()['data']['result'] ?? [];
            }

            
            $cpuResponse = Http::timeout(5)->get('http://prometheus:9090/api/v1/query', [
                'query' => 'sum(rate(container_cpu_usage_seconds_total[1m])) by (name)'
            ]);

            if ($cpuResponse->successful()) {
                $metricsData['CPU_Usage_Rate'] = $cpuResponse->json()['data']['result'] ?? [];
            }

            
            if (empty($metricsData)) {
                return response("Failed to fetch data from Prometheus. Please ensure the containers are running.")
                        ->header('Content-Type', 'text/plain; charset=utf-8');
            }

            
            $analysisReport = $analyzer->analyzeWithAI($metricsData);

            
            return view('security.analysis', ['report' => $analysisReport]);

        } catch (\Exception $e) {
            return response("Error: " . $e->getMessage())->header('Content-Type', 'text/plain; charset=utf-8');
        }
    }
}