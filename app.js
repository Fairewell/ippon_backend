require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./src/utils/logger');
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

// Middleware безопасности
app.use(helmet());

// Настройка CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Fixed typo: credential -> credentials
};
app.use(cors(corsOptions));
// Parse JSON bodies
app.use(express.json());

// Routes
const authRoutes = require('./src/routes/authRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);

// Admin routes
const adminRoutes = require('./src/routes/adminRoutes');
app.use('/api/admin', adminRoutes);

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