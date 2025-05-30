# Руководство администратора

## Управление пользователями
1. **Добавление администратора**:
   ```bash
   POST /api/users/admin
   {
     "username": "admin2",
     "password": "SecurePass123!"
   }
   ```

2. **Просмотр логов**:
   - Доступ к файлу `app.log`
   - Фильтрация ошибок: `grep "ERROR" app.log`

## Резервное копирование
1. Экспорт базы данных:
   ```bash
   mysqldump -u root -p salon_db > backup.sql
   ```
2. Восстановление из backup.sql

## Мониторинг
- Используйте `pm2 monit` для отслеживания процессов
- Настройка оповещений в Telegram через `src/services/telegramService.js`