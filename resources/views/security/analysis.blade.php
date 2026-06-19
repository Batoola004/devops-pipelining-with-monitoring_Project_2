<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛡️ Security Analysis Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a1a;
            color: #e2e8f0;
            min-height: 100vh;
            padding: 40px 20px;
            line-height: 1.7;
        }

        .container {
            max-width: 920px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 32px;
        }

        .header h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.02em;
        }

        .header .subtitle {
            color: #94a3b8;
            font-size: 0.875rem;
            margin-top: 4px;
        }

        .card {
            background: linear-gradient(145deg, #13132a, #1a1a3e);
            border: 1px solid rgba(139, 92, 246, 0.15);
            border-radius: 20px;
            padding: 44px 48px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(139, 92, 246, 0.05);
            position: relative;
            overflow: hidden;
        }

        .card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 60%);
            pointer-events: none;
        }

        .card > * {
            position: relative;
            z-index: 1;
        }

        /* Markdown-styled content */
        .card h1 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #fff;
            margin-bottom: 20px;
            letter-spacing: -0.02em;
        }

        .card h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #a78bfa;
            margin-top: 32px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(139, 92, 246, 0.15);
        }

        .card h3 {
            font-size: 1.05rem;
            font-weight: 600;
            color: #c4b5fd;
            margin-top: 20px;
            margin-bottom: 8px;
        }

        .card p {
            margin-bottom: 12px;
            color: #cbd5e1;
        }

        .card strong {
            color: #f1f5f9;
            font-weight: 600;
        }

        .card ul {
            padding-left: 24px;
            margin-bottom: 16px;
            list-style: none;
        }

        .card ul li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 8px;
            color: #cbd5e1;
        }

        .card ul li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #a78bfa;
            font-weight: 700;
        }

        .card code {
            font-family: 'Fira Code', monospace;
            background: rgba(139, 92, 246, 0.1);
            color: #c4b5fd;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.875em;
        }

        .card pre {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(139, 92, 246, 0.1);
            border-radius: 12px;
            padding: 16px 20px;
            margin: 12px 0 20px;
            overflow-x: auto;
        }

        .card pre code {
            background: none;
            padding: 0;
            color: #e2e8f0;
        }

        .card hr {
            border: none;
            border-top: 1px solid rgba(139, 92, 246, 0.1);
            margin: 24px 0;
        }

        .card blockquote {
            border-left: 3px solid #a78bfa;
            padding: 12px 20px;
            margin: 16px 0;
            background: rgba(139, 92, 246, 0.05);
            border-radius: 0 12px 12px 0;
            color: #94a3b8;
        }

        /* Threat level badges */
        .threat-safe { color: #4ade80; }
        .threat-warning { color: #facc15; }
        .threat-critical { color: #f87171; }

        .badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.03em;
        }

        .badge-safe {
            background: rgba(74, 222, 128, 0.15);
            color: #4ade80;
            border: 1px solid rgba(74, 222, 128, 0.25);
        }

        .badge-warning {
            background: rgba(250, 204, 21, 0.15);
            color: #facc15;
            border: 1px solid rgba(250, 204, 21, 0.25);
        }

        .badge-critical {
            background: rgba(248, 113, 113, 0.15);
            color: #f87171;
            border: 1px solid rgba(248, 113, 113, 0.25);
        }

        /* Loading / error states */
        .loading {
            text-align: center;
            padding: 60px 20px;
        }

        .loading .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(139, 92, 246, 0.15);
            border-top-color: #a78bfa;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .footer {
            text-align: center;
            margin-top: 24px;
            font-size: 0.8rem;
            color: #475569;
        }

        /* Responsive */
        @media (max-width: 640px) {
            body { padding: 20px 12px; }
            .card { padding: 24px 20px; }
            .card h1 { font-size: 1.35rem; }
        }

        /* a */
        a {
            color: #a78bfa;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Security Analysis</h1>
            <p class="subtitle">Real-time server security report powered by AI</p>
        </div>

        <div class="card">
            {!! Illuminate\Support\Str::markdown($report) !!}
        </div>

        <div class="footer">
            FiberRoad DevOps Pipeline · Security Monitor
        </div>
    </div>
</body>
</html>
