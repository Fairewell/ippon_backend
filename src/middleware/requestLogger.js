const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Логирование входящего запроса
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  
  // Перехват события завершения ответа
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`Response: ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });
  
  next();
};

module.exports = requestLogger;