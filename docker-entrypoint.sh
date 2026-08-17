#!/bin/bash
set -e

if [ -f /var/www/artisan ]; then
    echo ">>> Running Laravel optimizations..."

    php artisan optimize:clear --no-interaction 2>/dev/null || true


    echo ">>> Setting server start time..."
    php -r "
        \$app = require '/var/www/bootstrap/app.php';
        \$kernel = \$app->make(Illuminate\Contracts\Console\Kernel::class);
        \$kernel->bootstrap();
        cache()->forever('metrics:server_start_time', time());
        echo 'Server start time set to ' . time() . PHP_EOL;
    " 2>&1 || echo ">>> WARNING: Failed to set server start time" >&2


    php artisan config:cache --no-interaction 2>/dev/null || true
    php artisan route:cache --no-interaction 2>/dev/null || true
    php artisan view:cache --no-interaction 2>/dev/null || true


    if [ "${RUN_MIGRATIONS}" = "true" ]; then
        echo ">>> Waiting for database connection..."
        MAX_RETRIES=30
        RETRY_COUNT=0
        until php artisan db:show --no-interaction 2>/dev/null; do
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
                echo ">>> WARNING: Database not reachable after ${MAX_RETRIES} retries, skipping migrations..." >&2
                break
            fi
            echo ">>> Database unavailable, retrying in 2s (${RETRY_COUNT}/${MAX_RETRIES})..."
            sleep 2
        done

        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo ">>> Running database migrations..."
            php artisan migrate --force --no-interaction 2>&1
        fi
    fi

    echo ">>> Laravel optimizations complete."
fi


exec "$@"
