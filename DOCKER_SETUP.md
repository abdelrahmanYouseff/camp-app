# 🐳 Docker Setup - Campaign Sender

## 📋 الملفات المضافة

تم إعداد المشروع بالكامل للعمل مع Docker. الملفات التالية تم إنشاؤها:

### ملفات Docker الأساسية

1. **Dockerfile** - صورة Docker للتطبيق (Multi-stage build)
   - Stage 1: بناء Frontend assets (Vue.js)
   - Stage 2: تطبيق Laravel مع PHP-FPM, Nginx, Supervisor

2. **docker-compose.yml** - إعداد الحاويات:
   - `app`: تطبيق Laravel
   - `mysql`: قاعدة بيانات MySQL 8.0
   - `redis`: Redis للـ Queue و Cache

3. **docker/nginx.conf** - إعدادات Nginx
4. **docker/supervisord.conf** - إعدادات Supervisor (PHP-FPM, Nginx, Horizon)
5. **docker-entrypoint.sh** - سكريبت الإعداد التلقائي
6. **.dockerignore** - ملفات مستثناة من Docker build

### ملفات الإعداد

7. **.env.docker.example** - مثال لملف البيئة
8. **docker-compose.prod.yml** - إعدادات الإنتاج
9. **docker-start.sh** - سكريبت البدء السريع

### التوثيق

10. **DOCKER.md** - دليل شامل بالعربية
11. **README.md** - دليل سريع
12. **DOCKER_SETUP.md** - هذا الملف

## 🚀 البدء السريع

### الطريقة 1: استخدام السكريبت (موصى به)

```bash
./docker-start.sh
```

### الطريقة 2: يدوياً

```bash
# 1. نسخ ملف البيئة
cp .env.docker.example .env

# 2. تعديل .env بإعداداتك
nano .env

# 3. بناء الصور
docker-compose build

# 4. تشغيل الحاويات
docker-compose up -d

# 5. إعداد قاعدة البيانات
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan storage:link
```

## 📝 إعدادات مهمة في .env

```env
# قاعدة البيانات
DB_DATABASE=campaign_sender
DB_USERNAME=campaign_user
DB_PASSWORD=your_secure_password
DB_ROOT_PASSWORD=your_root_password

# WhatsApp API
WHATSAPP_PHONE_NUMBER=+966579588727
WHATSAPP_PHONE_NUMBER_ID=1025691777290835
WHATSAPP_BUSINESS_ACCOUNT_ID=945635341126497
WHATSAPP_ACCESS_TOKEN=your_token

# التطبيق
APP_URL=http://localhost:8000
APP_ENV=production
APP_DEBUG=false
```

## 🔧 الأوامر المفيدة

```bash
# عرض حالة الحاويات
docker-compose ps

# عرض السجلات
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f redis

# إيقاف الحاويات
docker-compose stop

# إيقاف وحذف
docker-compose down

# إعادة بناء
docker-compose build --no-cache

# تنفيذ أوامر Artisan
docker-compose exec app php artisan <command>

# الوصول إلى shell
docker-compose exec app sh

# Horizon Status
docker-compose exec app php artisan horizon:status
```

## 🌐 النشر على السيرفر

### 1. رفع الملفات

```bash
# استخدم Git أو SCP
git clone <repository>
# أو
scp -r . user@server:/path/to/app
```

### 2. على السيرفر

```bash
cd /path/to/app

# نسخ ملف البيئة
cp .env.docker.example .env
nano .env  # تعديل الإعدادات

# بناء وتشغيل
docker-compose build
docker-compose up -d

# إعداد قاعدة البيانات
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --force
```

### 3. إعداد Nginx Reverse Proxy (اختياري)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 الأمان

1. ✅ غير كلمات المرور الافتراضية
2. ✅ استخدم SSL في الإنتاج
3. ✅ قم بتحديث Docker بانتظام
4. ✅ راقب السجلات
5. ✅ استخدم Firewall

## 📊 البنية

```
campign_sender/
├── Dockerfile                 # صورة Docker
├── docker-compose.yml         # إعدادات الحاويات
├── docker-compose.prod.yml    # إعدادات الإنتاج
├── docker-entrypoint.sh       # سكريبت الإعداد
├── .dockerignore              # ملفات مستثناة
├── .env.docker.example        # مثال ملف البيئة
├── docker-start.sh            # سكريبت البدء السريع
├── docker/
│   ├── nginx.conf            # إعدادات Nginx
│   └── supervisord.conf       # إعدادات Supervisor
├── DOCKER.md                  # دليل شامل
└── README.md                  # دليل سريع
```

## 🐛 استكشاف الأخطاء

### المشكلة: الحاوية لا تبدأ

```bash
docker-compose logs app
docker-compose ps
```

### المشكلة: خطأ في قاعدة البيانات

```bash
# تحقق من MySQL
docker-compose exec mysql mysqladmin ping -h localhost -u root -p

# تحقق من المتغيرات
docker-compose exec app env | grep DB_
```

### المشكلة: Horizon لا يعمل

```bash
docker-compose exec app php artisan horizon:status
docker-compose restart app
```

### المشكلة: مشاكل الصلاحيات

```bash
docker-compose exec app chown -R www-data:www-data /var/www/html/storage
docker-compose exec app chmod -R 775 /var/www/html/storage
```

## 📚 مراجع

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Laravel Horizon](https://laravel.com/docs/horizon)
- [Docker Compose](https://docs.docker.com/compose/)

## ✅ Checklist قبل النشر

- [ ] تم تعديل جميع كلمات المرور في `.env`
- [ ] تم إضافة بيانات WhatsApp API الصحيحة
- [ ] تم تعيين `APP_URL` بشكل صحيح
- [ ] تم تعيين `APP_ENV=production`
- [ ] تم تعيين `APP_DEBUG=false`
- [ ] تم اختبار التطبيق محلياً
- [ ] تم إعداد SSL (للإنتاج)
- [ ] تم إعداد النسخ الاحتياطي

---

**تم إعداد المشروع بنجاح! 🎉**

للحصول على مساعدة إضافية، راجع `DOCKER.md`
