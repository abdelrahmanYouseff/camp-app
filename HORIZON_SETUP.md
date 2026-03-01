# تشغيل Horizon للـ Queue

## المشكلة: الحملات تبقى في حالة "Pending"

السبب: Horizon أو Queue Worker غير شغال.

## الحل:

### الخيار 1: استخدام Horizon (موصى به)

```bash
php artisan horizon
```

هذا الأمر يشغل Horizon في الخلفية ويعالج جميع الـ Jobs.

### الخيار 2: استخدام Queue Worker العادي

```bash
php artisan queue:work
```

### الخيار 3: تشغيل Horizon في الخلفية

```bash
php artisan horizon &
```

أو باستخدام `nohup`:

```bash
nohup php artisan horizon > storage/logs/horizon.log 2>&1 &
```

## التحقق من الحالة:

```bash
php artisan horizon:status
```

## إعدادات .env المطلوبة:

```env
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_CLIENT=predis
```

أو إذا كنت تستخدم database queue:

```env
QUEUE_CONNECTION=database
```

## ملاحظة:

- تأكد من أن Redis يعمل إذا كنت تستخدم `QUEUE_CONNECTION=redis`
- تأكد من تشغيل migrations إذا كنت تستخدم `QUEUE_CONNECTION=database`:
  ```bash
  php artisan queue:table
  php artisan migrate
  ```
