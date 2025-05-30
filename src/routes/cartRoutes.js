const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Получить корзину
router.get('/', authMiddleware, cartController.getCart);

// Добавить в корзину
router.post('/add', authMiddleware, cartController.addToCart);

// Удалить из корзины
router.delete('/:id', authMiddleware, cartController.removeFromCart);

// Очистить корзину
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;