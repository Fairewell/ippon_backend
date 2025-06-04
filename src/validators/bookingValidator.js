const { body, validationResult } = require('express-validator');
const { isValidObjectId } = require('mongoose');

exports.createBookingValidator = [
  // Общие проверки
  body('serviceId')
    .exists().withMessage('Service ID is required')
    .custom(value => isValidObjectId(value)).withMessage('Invalid Service ID format'),
  
  body('startDate')
    .exists().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format (ISO8601 expected)'),
  
  body('endDate')
    .exists().withMessage('End date is required')
    .isISO8601().withMessage('Invalid end date format (ISO8601 expected)')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  // Проверки для гостей
  (req, res, next) => {
    if (!req.user) {
      // Для неавторизованных пользователей добавляем дополнительные проверки
      body('guestName')
        .exists().withMessage('Guest name is required for anonymous bookings')
        .isLength({ min: 2 }).withMessage('Guest name must be at least 2 characters'),
      
      body('guestEmail')
        .exists().withMessage('Guest email is required for anonymous bookings')
        .isEmail().withMessage('Invalid email format'),
      
      body('guestPhone')
        .exists().withMessage('Guest phone is required for anonymous bookings')
        .isMobilePhone().withMessage('Invalid phone number format')
    }
    next();
  },

  // Обработка ошибок валидации
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];