const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger'); // Добавлен импорт логгера
const { Booking } = require('../models/Booking');
const { Service } = require('../models/Service');
const { User } = require('../models/User');

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Отправка уведомления о новом бронировании
exports.sendNewBookingNotification = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const service = await Service.findById(booking.service_id);
    const user = await User.findById(booking.user_id);

    if (!service || !user) return;

    const message = `
      🎉 Новое бронирование!
      Услуга: ${service.name}
      Пользователь: ${user.username} (${user.email})
      Период: ${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}
      Сумма: ${booking.total_price} руб.
      Статус: ${booking.status}
    `;

    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    logger.error('Telegram notification error:', error);
  }
};

// Отправка уведомления об изменении статуса бронирования
exports.sendBookingStatusUpdate = async (bookingId, oldStatus, newStatus) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const service = await Service.findById(booking.service_id);
    const user = await User.findById(booking.user_id);

    if (!service || !user) return;

    const message = `
      🔄 Изменение статуса бронирования #${booking.id}
      Услуга: ${service.name}
      Пользователь: ${user.username}
      Статус: ${oldStatus} → ${newStatus}
    `;

    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message);
  } catch (error) {
    logger.error('Telegram status update error:', error);
  }
};