# Интеграция сервисов через middleware

## Структура таблицы Services
```sql
CREATE TABLE Services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Примеры SQL-запросов

### Создание сервиса
```sql
INSERT INTO Services (name, description, price_per_day)
VALUES ('Уборка дома', 'Комплексная уборка квартиры', 1500.00);
```

### Обновление сервиса
```sql
UPDATE Services 
SET price_per_day = 1700.00, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Интеграция с serviceController.js
Для обработки запросов в middleware используйте следующие методы:

```javascript
// Пример middleware для валидации
const validateServiceData = (req, res, next) => {
    const { name, price_per_day } = req.body;
    
    if (!name || !price_per_day) {
        return res.status(400).json({ error: 'Необходимо указать название и цену услуги' });
    }
    
    next();
};

// Подключение в роуте
router.post('/services', validateServiceData, serviceController.createService);
```

## Рекомендации
1. Все запросы к БД должны использовать параметризованные запросы для защиты от SQL-инъекций
2. Для сложных операций используйте транзакции
3. Обновляйте поле `updated_at` при каждом изменении записи