# Docker Setup Guide - Campaign Sender

دليل شامل لإعداد وتشغيل منصة إرسال حملات الواتساب باستخدام Docker.

## المتطلبات الأساسية

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## الإعداد السريع

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd campign_sender
```

### 2. إعداد ملف البيئة

انسخ ملف `.env.example` إلى `.env` وقم بتعديل القيم:

```bash
cp .env.example .env
```

قم بتعديل القيم التالية في ملف `.env`:

```env
APP_NAME="Campaign Sender"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://your-domain.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=campaign_sender
DB_USERNAME=campaign_user
DB_PASSWORD=your_secure_password
DB_ROOT_PASSWORD=your_root_password

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_CLIENT=predis

QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# WhatsApp Business API Credentials
WHATSAPP_PHONE_NUMBER=+966579588727
WHATSAPP_PHONE_NUMBER_ID=1025691777290835
WHATSAPP_BUSINESS_ACCOUNT_ID=945635341126497
WHATSAPP_ACCESS_TOKEN=your_access_token
```

### 3. بناء وتشغيل الحاويات

```bash
# بناء الصور
docker-compose build

# تشغيل الحاويات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

### 4. إعداد قاعدة البيانات

```bash
# توليد مفتاح التطبيق
docker-compose exec app php artisan key:generate

# تشغيل Migrations
docker-compose exec app php artisan migrate --force

# إنشاء رابط التخزين
docker-compose exec app php artisan storage:link

# تحسين الأداء
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache
docker-compose exec app php artisan view:cache
```

### 5. الوصول للتطبيق

افتح المتصفح على: `http://localhost:8000`

## الأوامر المفيدة

### إدارة الحاويات

```bash
# إيقاف الحاويات
docker-compose stop

# إيقاف وحذف الحاويات
docker-compose down

# إعادة بناء الصور
docker-compose build --no-cache

# عرض حالة الحاويات
docker-compose ps

# عرض السجلات
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f redis
```

### أوامر Laravel

```bash
# تنفيذ أوامر Artisan
docker-compose exec app php artisan <command>

# الوصول إلى shell الحاوية
docker-compose exec app sh

# عرض سجلات Horizon
docker-compose exec app php artisan horizon:status
```

### قاعدة البيانات

```bash
# الوصول إلى MySQL
docker-compose exec mysql mysql -u campaign_user -p campaign_sender

# نسخ احتياطي
docker-compose exec mysql mysqldump -u campaign_user -p campaign_sender > backup.sql

# استعادة نسخة احتياطية
docker-compose exec -T mysql mysql -u campaign_user -p campaign_sender < backup.sql
```

### Redis

```bash
# الوصول إلى Redis CLI
docker-compose exec redis redis-cli

# مسح Cache
docker-compose exec redis redis-cli FLUSHALL
```

## البنية

المشروع يحتوي على الحاويات التالية:

- **app**: تطبيق Laravel مع PHP-FPM و Nginx و Horizon
- **mysql**: قاعدة بيانات MySQL 8.0
- **redis**: Redis للـ Queue و Cache

## الإنتاج (Production)

### 1. تحديث ملف `.env`

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
```

### 2. استخدام SSL

أضف Nginx Reverse Proxy مع SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. النسخ الاحتياطي

قم بإنشاء سكريبت للنسخ الاحتياطي:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T mysql mysqldump -u campaign_user -p$DB_PASSWORD campaign_sender > backup_$DATE.sql
```

## استكشاف الأخطاء

### المشكلة: الحاوية لا تبدأ

```bash
# تحقق من السجلات
docker-compose logs app

# تحقق من حالة الحاويات
docker-compose ps
```

### المشكلة: خطأ في الاتصال بقاعدة البيانات

```bash
# تحقق من صحة MySQL
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# تحقق من متغيرات البيئة
docker-compose exec app env | grep DB_
```

### المشكلة: Horizon لا يعمل

```bash
# تحقق من حالة Horizon
docker-compose exec app php artisan horizon:status

# إعادة تشغيل Horizon
docker-compose restart app
```

### المشكلة: المشاكل في الصلاحيات

```bash
# إصلاح الصلاحيات
docker-compose exec app chown -R www-data:www-data /var/www/html/storage
docker-compose exec app chmod -R 775 /var/www/html/storage
```

## الأمان

1. **غير كلمات المرور الافتراضية** في `.env`
2. **استخدم SSL** في الإنتاج
3. **قم بتحديث Docker** بانتظام
4. **راقب السجلات** بانتظام
5. **استخدم Firewall** على السيرفر

## الدعم

للمساعدة، راجع:
- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Laravel Horizon Documentation](https://laravel.com/docs/horizon)
