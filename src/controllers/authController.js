const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger'); // Добавлен импорт логгера

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Базовая валидация
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const user = await User.create({ username, email, password });
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    logger.error('Registration error:', error);
    let status = 500;
    let message = 'Registration failed';
    let details = null;

    // Обработка ошибок валидации и конфликтов
    if (error.name === 'SequelizeUniqueConstraintError') {
      status = 409;
      message = 'Email already in use';
      details = error.errors.map(err => err.message).join('; ');
    } else if (error.name === 'ValidationError') {
      status = 400;
      message = 'Validation error';
      details = error.errors.map(err => err.message).join('; ');
    } else {
      details = error.message;
    }

    res.status(status).json({ error: message, details });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Базовая валидация
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await User.comparePasswords(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    let status = 500;
    let message = 'Login failed';
    let details = error.message;

    res.status(status).json({ error: message, details });
  }
};

// Получение текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    let status = 500;
    let message = 'Failed to get current user';
    let details = error.message;

    res.status(status).json({ error: message, details });
  }
};