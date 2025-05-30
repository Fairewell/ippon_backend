const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Предположим, что у нас есть middleware для проверки админских прав

// Получить все услуги
router.get('/', serviceController.getAllServices);

// Получить услугу по ID
router.get('/:id', serviceController.getServiceById);

// Проверить доступность услуги на даты
router.get('/:id/available', serviceController.checkAvailability);

// Создать услугу (только админ)
router.post('/', authMiddleware, adminMiddleware, serviceController.createService);

// Обновить услугу (только админ)
router.put('/:id', authMiddleware, adminMiddleware, serviceController.updateService);

// Удалить услугу (только админ)
router.delete('/:id', authMiddleware, adminMiddleware, serviceController.deleteService);

module.exports = router;