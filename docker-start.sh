#!/bin/bash

# Campaign Sender - Docker Quick Start Script

set -e

echo "🚀 Campaign Sender - Docker Setup"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.docker.example..."
    if [ -f .env.docker.example ]; then
        cp .env.docker.example .env
        echo "✅ .env file created. Please edit it with your configuration."
    else
        echo "❌ .env.docker.example not found!"
        exit 1
    fi
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔑 Generating application key..."
docker-compose exec -T app php artisan key:generate --force || echo "Key may already be set"

echo ""
echo "📦 Running migrations..."
docker-compose exec -T app php artisan migrate --force || echo "Migrations may have already been run"

echo ""
echo "🔗 Creating storage link..."
docker-compose exec -T app php artisan storage:link || echo "Storage link may already exist"

echo ""
echo "✨ Setup completed!"
echo ""
echo "📊 Application Status:"
docker-compose ps

echo ""
echo "🌐 Application URL: http://localhost:8000"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop containers: docker-compose stop"
echo "  - Restart containers: docker-compose restart"
echo "  - Access shell: docker-compose exec app sh"
echo ""
