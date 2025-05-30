const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Добавлен импорт логгера
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Получаем токен из заголовка Authorization
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя по ID из токена
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Добавляем пользователя в объект запроса
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;