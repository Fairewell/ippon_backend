# Справочник API

Данный документ содержит полное описание всех конечных точек API системы.

## Содержание
1. [Аутентификация](#аутентификация)
2. [Услуги](#услуги)
3. [Корзина](#корзина)
4. [Бронирования](#бронирования)

## Аутентификация
### Регистрация
- **Метод:** POST
- **URL:** `/auth/register`
- **Тело запроса (JSON):**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### Вход (получение токена)
- **Метод:** POST
- **URL:** `/auth/login`
- **Тело запроса (JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **В ответе:** токен в формате `{ "token": "..." }`

### Получение текущего пользователя
- **Метод:** GET
- **URL:** `/auth/me`
- **Заголовок:** `Authorization: Bearer <token>`

## Услуги
### Получить все услуги
- **Метод:** GET
- **URL:** `/services`

### Получить услугу по ID
- **Метод:** GET
- **URL:** `/services/:id`

### Проверить доступность услуги
- **Метод:** GET
- **URL:** `/services/:id/available?startDate=2025-06-01&endDate=2025-06-05`

### Создать услугу (только админ)
- **Метод:** POST
- **URL:** `/services`
- **Заголовок:** `Authorization: Bearer <admin_token>`
- **Тело запроса (JSON):**
```json
{
  "name": "Новая услуга",
  "description": "Описание услуги",
  "price_per_day": 1500
}
```

### Обновить услугу (только админ)
- **Метод:** PUT
- **URL:** `/services/:id`
- **Заголовок:** `Authorization: Bearer <admin_token>`
- **Тело запроса (JSON):**
```json
{
  "name": "Обновленное название",
  "description": "Обновленное описание",
  "price_per_day": 2000
}
```

### Удалить услугу (только админ)
- **Метод:** DELETE
- **URL:** `/services/:id`
- **Заголовок:** `Authorization: Bearer <admin_token>`

## Корзина
### Получить корзину
- **Метод:** GET
- **URL:** `/cart`
- **Заголовок:** `Authorization: Bearer <token>`

### Добавить услугу в корзину
- **Метод:** POST
- **URL:** `/cart/add`
- **Заголовок:** `Authorization: Bearer <token>`
- **Тело запроса (JSON):**
```json
{
  "serviceId": 1,
  "startDate": "2025-06-01",
  "endDate": "2025-06-05"
}
```

### Удалить услугу из корзины
- **Метод:** DELETE
- **URL:** `/cart/:id`
- **Заголовок:** `Authorization: Bearer <token>`

### Очистить корзину
- **Метод:** DELETE
- **URL:** `/cart`
- **Заголовок:** `Authorization: Bearer <token>`

## Бронирования
### Создать бронирование
- **Метод:** POST
- **URL:** `/bookings`
- **Тело запроса (JSON):**
- **Заголовок:** `Authorization: Bearer <token>`
```json
{
  "serviceId": 1,
  "startDate": "2025-06-01",
  "endDate": "2025-06-05",
  "guestName": "Имя гостя",   // Обязательно, если пользователь не авторизован
  "guestEmail": "guest@example.com", // Обязательно, если пользователь не авторизован
  "guestPhone": "+71234567890" // Обязательно, если пользователь не авторизован
}
```

### Получить бронирования пользователя
- **Метод:** GET
- **URL:** `/bookings`
- **Заголовок:** `Authorization: Bearer <token>`

### Обновить статус бронирования (только админ)
- **Метод:** PUT
- **URL:** `/bookings/:id/status`
- **Заголовок:** `Authorization: Bearer <admin_token>`
- **Тело запроса (JSON):**
```json
{
  "status": "confirmed"
}
```

### Оформить заказ из корзины
- **Метод:** POST
- **URL:** `/bookings/checkout`
- **Заголовок:** `Authorization: Bearer <token>`

## Отзывы

### Получить все отзывы
- **Метод:** GET
- **URL:** `/reviews`

### Получить отзывы по услуге
- **Метод:** GET
- **URL:** `/reviews/service/:serviceId`

### Создать отзыв (требуется авторизация)
- **Метод:** POST
- **URL:** `/reviews`
- **Заголовок:** `Authorization: Bearer <token>`
- **Тело запроса (JSON):**
```json
{
  "userId": 1,
  "serviceId": 1,
  "rating": 5,
  "comment": "Отличный сервис!"
}
```

### Обновить отзыв (требуется авторизация)
- **Метод:** PUT
- **URL:** `/reviews/:id`
- **Заголовок:** `Authorization: Bearer <token>`
- **Тело запроса (JSON):**
```json
{
  "rating": 4,
  "comment": "Хороший сервис, но дороговато."
}
```

### Удалить отзыв (требуется авторизация)
- **Метод:** DELETE
- **URL:** `/reviews/:id`
- **Заголовок:** `Authorization: Bearer <token>`

## Примечания
1. Для административных действий нужен пользователь с ролью `admin`
2. Даты передавать в формате `YYYY-MM-DD`
3. Большинство запросов требуют JWT-токен в заголовке, кроме:
   - Аутентификации
   - Создания бронирования без авторизации
4. Для тестирования доступности услуг используйте параметры запроса:
   `serviceId` - ID услуги
   `startDate` - дата начала
   `endDate` - дата окончания