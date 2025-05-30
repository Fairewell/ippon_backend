const logger = require('../utils/logger'); // Добавлен импорт логгера

const Cart = require('../models/Cart');
const Service = require('../models/Service');

// Получить содержимое корзины
exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findByUserId(req.user.id);
    res.json(cartItems);
  } catch (error) {
    logger.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

// Добавить услугу в корзину
exports.addToCart = async (req, res) => {
  try {
    const { serviceId, startDate, endDate } = req.body;
    
    // Проверка доступности услуги
    // (реальную проверку будем делать при оформлении)
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const cartItem = await Cart.addItem(req.user.id, { serviceId, startDate, endDate });
    res.status(201).json(cartItem);
  } catch (error) {
    logger.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Удалить услугу из корзины
exports.removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await Cart.removeItem(cartItemId);
    
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    logger.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// Очистить корзину
exports.clearCart = async (req, res) => {
  try {
    await Cart.clear(req.user.id);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    logger.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};