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

            // 1. استعلام عن ضغط الشبكة (اكتشاف DDoS)
            // نسحب معدل البيانات المستقبلة في آخر دقيقة
            $networkResponse = Http::timeout(5)->get('http://prometheus:9090/api/v1/query', [
                'query' => 'sum(rate(container_network_receive_bytes_total[1m])) by (name)'
            ]);
            
            if ($networkResponse->successful()) {
                $metricsData['Network_Traffic_Bytes_Per_Second'] = $networkResponse->json()['data']['result'] ?? [];
            }

            // 2. استعلام عن ضغط المعالج (اكتشاف Resource Exhaustion)
            $cpuResponse = Http::timeout(5)->get('http://prometheus:9090/api/v1/query', [
                'query' => 'sum(rate(container_cpu_usage_seconds_total[1m])) by (name)'
            ]);

            if ($cpuResponse->successful()) {
                $metricsData['CPU_Usage_Rate'] = $cpuResponse->json()['data']['result'] ?? [];
            }

            // إذا لم نتمكن من جلب البيانات
            if (empty($metricsData)) {
                return response("لم نتمكن من سحب البيانات من Prometheus. تأكد من عمل الحاويات.")
                        ->header('Content-Type', 'text/plain; charset=utf-8');
            }

            // 3. إرسال البيانات للذكاء الاصطناعي
            $analysisReport = $analyzer->analyzeWithAI($metricsData);

            // نرجع التقرير ليعرض في المتصفح
            return response($analysisReport)->header('Content-Type', 'text/plain; charset=utf-8');

        } catch (\Exception $e) {
            return response("حدث خطأ: " . $e->getMessage())->header('Content-Type', 'text/plain; charset=utf-8');
        }
    }
}