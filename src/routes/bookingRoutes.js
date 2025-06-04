const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const bookingValidator = require('../validators/bookingValidator'); // Добавлен импорт валидатора

// Создать бронирование
router.post('/', bookingValidator.createBookingValidator, bookingController.createBooking);

// Получить бронирования пользователя
router.get('/', authMiddleware, bookingController.getUserBookings);

// Обновить статус бронирования (админ)
router.put('/:id/status', authMiddleware, adminMiddleware, bookingController.updateBookingStatus);

// Оформить заказ из корзины
router.post('/checkout', authMiddleware, bookingController.checkout);

module.exports = router;