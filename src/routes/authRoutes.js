const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Получение текущего пользователя (требуется аутентификация)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;