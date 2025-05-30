# Руководство: Бронирование услуги

## Шаг 1. Регистрация
```bash
POST /auth/register
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "Pass123!"
}
```

## Шаг 2. Вход и получение токена
```bash
POST /auth/login
{
  "email": "user1@example.com",
  "password": "Pass123!"
}
```
- Сохраните полученный токен

## Шаг 3. Поиск услуг
```bash
GET /services
Authorization: Bearer <ваш_токен>
```

## Шаг 4. Проверка доступности
```bash
GET /services/1/available?startDate=2025-06-01&endDate=2025-06-05
Authorization: Bearer <ваш_токен>
```

## Шаг 5. Добавление в корзину
```bash
POST /cart/add
Authorization: Bearer <ваш_токен>
{
  "serviceId": 1,
  "startDate": "2025-06-01",
  "endDate": "2025-06-05"
}
```

## Шаг 6. Оформление бронирования
```bash
POST /bookings/checkout
Authorization: Bearer <ваш_токен>
```

## Шаг 7. Просмотр бронирований
```bash
GET /bookings
Authorization: Bearer <ваш_токен>
```

## Видео-демонстрация
[![Демонстрация бронирования](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

> Примечание: Замените VIDEO_ID на реальный идентификатор обучающего видео