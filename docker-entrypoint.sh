#!/bin/bash
set -e

# Run Laravel optimizations on container start
if [ -f /var/www/artisan ]; then
    echo ">>> Running Laravel optimizations..."

    # Seed server start time in cache for the uptime metric
    php artisan tinker --execute="Cache::forever('metrics:server_start_time', time());" --no-interaction 2>/dev/null || true

    # Clear any cached config/routes/views from previous builds
    php artisan optimize:clear --no-interaction 2>/dev/null || true

    # Cache config, routes, and views for production performance
    php artisan config:cache --no-interaction 2>/dev/null || true
    php artisan route:cache --no-interaction 2>/dev/null || true
    php artisan view:cache --no-interaction 2>/dev/null || true

    # Run pending database migrations
    if [ "${RUN_MIGRATIONS}" = "true" ]; then
        echo ">>> Running database migrations..."
        php artisan migrate --force --no-interaction 2>/dev/null || true
    fi

    echo ">>> Laravel optimizations complete."
fi

# Execute the CMD (php-fpm)
exec "$@"
