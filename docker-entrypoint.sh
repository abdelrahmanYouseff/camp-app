#!/bin/sh

set -e

echo "Starting application setup..."

# Wait for MySQL to be ready
echo "Waiting for MySQL..."
for i in 1 2 3 4 5 6 7 8 9 10; do
    if php artisan migrate:status > /dev/null 2>&1; then
        echo "MySQL is ready!"
        break
    fi
    echo "MySQL is unavailable - sleeping (attempt $i/10)"
    sleep 3
done

# Generate application key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Run migrations (only if not already run)
echo "Checking migrations..."
php artisan migrate --force || echo "Migrations may have already been run"

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link || echo "Storage link may already exist"
fi

# Generate Wayfinder types (after MySQL is ready and storage paths exist)
echo "Generating Wayfinder types..."
php artisan wayfinder:generate --with-form || echo "Wayfinder generation failed, will retry on next request"

# Clear and cache config (only in production)
if [ "$APP_ENV" = "production" ]; then
    echo "Optimizing application..."
    php artisan config:cache || echo "Config cache failed"
    php artisan route:cache || echo "Route cache failed"
    php artisan view:cache || echo "View cache failed"
fi

echo "Application setup completed!"

# Execute the main command
exec "$@"
