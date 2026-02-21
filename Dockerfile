# Multi-stage build for Laravel + Vue.js application with Wayfinder support

# Stage 1: Build frontend assets with PHP CLI for Wayfinder
FROM node:20-alpine AS frontend-builder

# Install PHP CLI and required extensions for Wayfinder
# Wayfinder needs PHP to run artisan commands during build
RUN apk add --no-cache \
    php-cli \
    php-json \
    php-phar \
    php-openssl \
    php-mbstring \
    php-tokenizer \
    php-xml \
    php-xmlwriter \
    php-simplexml \
    php-dom \
    php-fileinfo \
    php-pdo \
    php-pdo_mysql

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy Composer files (needed for Wayfinder to work)
COPY composer*.json ./

# Install Composer in the frontend builder stage
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install minimal Composer dependencies needed for Wayfinder
# We only need Laravel framework files, not all dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist || true

# Copy Laravel application files needed for Wayfinder
COPY app/ ./app/
COPY bootstrap/ ./bootstrap/
COPY config/ ./config/
COPY database/ ./database/
COPY routes/ ./routes/
COPY artisan ./

# Generate optimized autoloader
RUN composer dump-autoload --optimize --classmap-authoritative || true

# Copy frontend source files
COPY resources/ ./resources/
COPY vite.config.ts tsconfig.json components.json ./
COPY public/ ./public/

# Build frontend assets (Wayfinder will use PHP CLI here)
RUN npm run build

# Stage 2: PHP FPM Alpine for Laravel runtime
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    mysql-client \
    nginx \
    supervisor \
    libjpeg-turbo-dev \
    freetype-dev

# Install PHP extensions required for Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Install Redis extension
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del pcre-dev $PHPIZE_DEPS

# Configure PHP for production
RUN echo "memory_limit = 256M" > /usr/local/etc/php/conf.d/memory.ini \
    && echo "upload_max_filesize = 64M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time = 300" > /usr/local/etc/php/conf.d/execution.ini

# Configure OPcache for production
RUN echo "opcache.enable=1" > /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.save_comments=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Composer files
COPY composer*.json ./

# Install PHP dependencies optimized for production
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

# Copy Laravel application files
COPY . .

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Run Composer scripts (post-install hooks)
RUN composer dump-autoload --optimize --classmap-authoritative

# Set proper permissions for Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/public

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start supervisor (which manages PHP-FPM, Nginx, and Horizon)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
