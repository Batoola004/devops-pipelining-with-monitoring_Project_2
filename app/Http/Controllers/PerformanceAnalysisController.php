<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PerformanceAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        try {
            $metricsData = [];

            $prometheus = 'http://prometheus:9090';

            
            $queries = [
                'avg_response_time_ms' => 'avg(laravel_app_response_time_ms)',
                'error_rate_percent'   => 'avg(laravel_app_error_rate_percent)',
                'request_rate_per_sec' => 'sum(rate(laravel_app_requests_total[5m]))',
                'memory_bytes'         => 'avg(laravel_app_memory_bytes)',
                'active_instances'     => 'count(laravel_app_instance)',
                'uptime_seconds'       => 'avg(laravel_app_uptime_seconds)',
                'storage_percent'      => 'avg(laravel_app_storage_used_percent)',
            ];

            foreach ($queries as $key => $query) {
                $response = Http::timeout(10)->get("{$prometheus}/api/v1/query", [
                    'query' => $query,
                ]);
                if ($response->successful()) {
                    $metricsData[$key] = $response->json()['data']['result'] ?? [];
                }
            }

            if (empty($metricsData)) {
                return view('security.analysis', [
                    'report' => '⚠️ Could not fetch metrics from Prometheus. Ensure all containers are running.',
                ]);
            }

            
            $analysisReport = $this->analyzeWithAI($metricsData);

            return view('security.analysis', [
                'report' => $analysisReport,
                'title' => '⚡ AI-Powered Performance Analysis',
            ]);

        } catch (\Exception $e) {
            Log::error('Performance analysis failed: ' . $e->getMessage());

            return view('security.analysis', [
                'report' => '❌ Error: ' . $e->getMessage(),
                'title' => '⚡ AI-Powered Performance Analysis',
            ]);
        }
    }

    private function analyzeWithAI(array $metricsData): string
    {
        $apiKey = config('services.openrouter.api_key');
        if (empty($apiKey)) {
            return "⚠️ OpenRouter API key not configured. Please add `OPENROUTER_API_KEY` to your `.env` file.\n\nThe raw metrics data is still available below for manual inspection.";
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])
            ->timeout(220)
            ->retry(3, 2000)
            ->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => 'poolside/laguna-xs.2:free',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You are an elite Site Reliability Engineer (SRE) and Performance Analyst. You receive live application metrics from Prometheus.

Your job:
1. Analyze response time — identify latency issues
2. Check error rates — detect error budget burn
3. Review load balancing distribution across instances — detect imbalance
4. Check memory trends — detect memory leaks
5. Review storage usage — predict disk exhaustion
6. Check instance count — verify high availability
7. Review overall system health and provide actionable recommendations

You MUST return your analysis in the following strict Markdown format:

### ⚡ Performance Analysis Report
**🏥 Overall Health:** [Healthy 🟢 / Degraded 🟡 / Critical 🔴]

**📊 Key Metrics Summary:**
[Brief summary of key metrics in 2-3 lines]

**🎯 Issues Detected:**
- [Issue 1 with severity]
- [Issue 2 with severity]

**💡 Recommendations:**
- [Actionable recommendation 1]
- [Actionable recommendation 2]

**📈 Trends & Insights:**
[Any notable patterns or trends]"
                    ],
                    [
                        'role' => 'user',
                        'content' => 'Analyze the following live Prometheus metrics: ' . json_encode($metricsData)
                    ]
                ],
            ]);

            if ($response->successful()) {
                return $response->json()['choices'][0]['message']['content'];
            }

            $status = $response->status();
            $body = $response->body();
            Log::warning("OpenRouter API returned {$status}: {$body}");

            
            return $this->generateFallbackAnalysis($metricsData);

        } catch (\Exception $e) {
            Log::error('AI analysis service error: ' . $e->getMessage());
            return $this->generateFallbackAnalysis($metricsData);
        }
    }

    


    private function generateFallbackAnalysis(array $metricsData): string
    {
        $lines = [];
        $lines[] = "### ⚡ Performance Analysis (Offline — AI Unavailable)";
        $lines[] = "";
        $lines[] = "> **Note:** The AI analysis service (OpenRouter) is currently unavailable. Below is the raw metrics data for manual review.";
        $lines[] = "";
        $lines[] = "**📊 Raw Metrics:**";
        $lines[] = "";

        foreach ($metricsData as $metric => $results) {
            $lines[] = "**{$metric}:**";
            if (empty($results)) {
                $lines[] = "  - No data";
            } else {
                foreach ($results as $result) {
                    $value = $result['value'][1] ?? 'N/A';
                    $metric_name = $result['metric']['__name__'] ?? '';
                    $instance = $result['metric']['instance'] ?? 'all';
                    $lines[] = "  - `{$instance}`: **{$value}**";
                }
            }
            $lines[] = "";
        }

        $lines[] = "---";
        $lines[] = "💡 **Tip:** Ensure `OPENROUTER_API_KEY` is set in your `.env` and the OpenRouter service is accessible to get AI-powered analysis.";

        return implode("\n", $lines);
    }
}
