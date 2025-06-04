const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');
const { pool } = require('../config/database');
const logger = require('../utils/logger');

// Инициализация зависимостей
const userRepository = new UserRepository(pool);
const authService = new AuthService(userRepository);

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Валидация будет вынесена в отдельный слой
    const user = await authService.register({ username, email, password });
    
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
    let details = error.message;

    if (error.message.includes('Validation error')) {
      status = 400;
      message = 'Validation error';
    } else if (error.message.includes('Email already in use')) {
      status = 409;
      message = 'Email already in use';
    }

    res.status(status).json({ error: message, details });
  }
};

// Вход пользователя
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    
    const status = error.message.includes('Invalid credentials') ? 401 : 500;
    const message = error.message.includes('Invalid credentials')
      ? 'Invalid credentials'
      : 'Login failed';
      
    res.status(status).json({ error: message, details: error.message });
  }
};

// Получение текущего пользователя
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
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
    res.status(500).json({
      error: 'Failed to get current user',
      details: error.message
    });
  }
};