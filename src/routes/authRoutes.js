const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authValidator = require('../validators/authValidator');

// Регистрация с валидацией
router.post('/register', authValidator.registerValidator, authController.register);

// Вход с валидацией
router.post('/login', authValidator.loginValidator, authController.login);

// Получение текущего пользователя (требуется аутентификация)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;