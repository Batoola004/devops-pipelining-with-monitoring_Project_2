<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ServerSecurityAnalyzerService
{
    public function analyzeWithAI($metricsData)
{
    try {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.openrouter.api_key'),
            'Content-Type'  => 'application/json',
            
        ])
        ->timeout(220)
        ->retry(5, 1000)
        ->post('https://openrouter.ai/api/v1/chat/completions', [
            
            'model' => 'poolside/laguna-xs.2:free', 
            'messages' => [
                [
                    'role' => 'system', 
                    'content' => "You are an elite Cybersecurity SOC Analyst. You receive server metrics from Prometheus. Your job is to detect potential DDoS attacks, resource exhaustion, or anomalies.
                    
                    You MUST return your analysis in the following strict Markdown format:
                    
                    ### 🛡️ Security Analysis Report
                    **🚨 Threat Level:** [Safe 🟢 / Warning 🟡 / Critical 🔴]
                    
                    **📊 Metrics Overview:**
                    [Briefly summarize the metrics in 1-2 lines]
                    
                    **🕵️ Anomalies & Attack Patterns Detected:**
                    [Bullet points of any suspicious activity, e.g., 'High network traffic on Container X indicating possible DDoS']
                    
                    **💡 Actionable Recommendations:**
                    [Bullet points of steps the sysadmin should take immediately]"
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

        return " Error While Fetching AI Analysis: " . $response->status();

    } catch (\Exception $e) {
        return " Error in the service: " . $e->getMessage();
    }
}
}