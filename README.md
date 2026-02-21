# Campaign Sender - WhatsApp Campaign Platform

منصة احترافية لإرسال حملات الواتساب باستخدام WhatsApp Business API.

## المميزات

- ✅ إرسال حملات جماعية عبر الواتساب
- ✅ إدارة قوالب الرسائل (Templates)
- ✅ جدولة الحملات
- ✅ تتبع حالة الإرسال في الوقت الفعلي
- ✅ إحصائيات مفصلة لكل حملة
- ✅ معالجة غير متزامنة باستخدام Laravel Horizon
- ✅ واجهة مستخدم احترافية وسهلة الاستخدام

## المتطلبات

- Docker 20.10+
- Docker Compose 2.0+

## الإعداد السريع

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd campign_sender
```

### 2. إعداد ملف البيئة

```bash
cp .env.docker.example .env
```

قم بتعديل ملف `.env` وأضف بياناتك:
- قاعدة البيانات
- بيانات WhatsApp Business API
- إعدادات التطبيق

### 3. بناء وتشغيل

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
```

### 5. الوصول للتطبيق

افتح المتصفح على: `http://localhost:8000`

## الأوامر المفيدة

```bash
# إيقاف الحاويات
docker-compose stop

# إيقاف وحذف الحاويات
docker-compose down

# إعادة بناء الصور
docker-compose build --no-cache

# عرض السجلات
docker-compose logs -f app

# تنفيذ أوامر Artisan
docker-compose exec app php artisan <command>

# الوصول إلى shell الحاوية
docker-compose exec app sh
```

## البنية

- **app**: تطبيق Laravel مع PHP-FPM و Nginx و Horizon
- **mysql**: قاعدة بيانات MySQL 8.0
- **redis**: Redis للـ Queue و Cache

## التوثيق الكامل

راجع ملف [DOCKER.md](./DOCKER.md) للحصول على دليل شامل.

## الدعم

للمساعدة، راجع:
- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Laravel Horizon Documentation](https://laravel.com/docs/horizon)

## الترخيص

MIT License
