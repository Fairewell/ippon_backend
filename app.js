require('dotenv').config();
const express = require('express');
const logger = require('./src/utils/logger'); // Добавлен импорт логгера
const app = express();
const port = process.env.PORT || 3000;

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Обработка необработанных отказов промисов
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(express.json());
app.use(require('./src/middleware/requestLogger')); // Добавляем middleware для логирования запросов

// Routes
const authRoutes = require('./src/routes/authRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cart', cartRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend IPPON is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack); // Заменено на logger.error
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection
const db = require('./src/config/database');
db.connect()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`); // Заменено на logger.info
    });
  })
  .catch(err => {
    logger.error('Database connection failed', err); // Заменено на logger.error
    process.exit(1);
  });