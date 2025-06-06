const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Инициализация бота
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Текущий chat_id (можно менять через API)
let currentChatId = process.env.TELEGRAM_CHAT_ID;

// Установка нового chat_id
exports.setTelegramChatId = (chatId) => {
  currentChatId = chatId;
  logger.info(`Telegram chat ID updated to: ${chatId}`);
};

// Отправка уведомления о новом бронировании
exports.sendNewBookingNotification = async (bookingId, chatId = currentChatId) => {
  try {
    logger.info(`Sending new booking notification for booking ID: ${bookingId} to chat ID: ${chatId}`);
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const service = await Service.findById(booking.service_id);
    if (!service) return;

    let user;
    if (booking.user_id) {
        user = await User.findById(booking.user_id);
    }
    if (!user) {
        // Используем гостевые данные
        user = {
            username: booking.guest_name || 'Гость',
            email: booking.guest_email || 'Не указан',
            phone: booking.guest_phone || 'Не указан',
        };
    }

    const message = `
      🎉 Новое бронирование!
      Услуга: ${service.name}
      Пользователь: ${user.username} (${user.email})
      Период: ${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}
      Сумма: ${booking.total_price} руб.
      Статус: ${booking.status}
      ID бронирования: ${booking.id}
      Контактный телефон: ${user.phone}
    `;

    await bot.sendMessage(chatId, message);
    logger.info(`Notification sent for booking ID: ${bookingId}`);
  } catch (error) {
    logger.error('Telegram notification error:', error);
  }
};

// Отправка уведомления об изменении статуса бронирования
exports.sendBookingStatusUpdate = async (bookingId, oldStatus, newStatus, chatId = currentChatId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const service = await Service.findById(booking.service_id);
    if (!service) return;

    let user;
    if (booking.user_id) {
        user = await User.findById(booking.user_id);
    }
    if (!user) {
        // Используем гостевые данные
        user = {
            username: booking.name || 'Гость',
            email: booking.email || 'Не указан'
        };
    }

    const message = `
      🔄 Изменение статуса бронирования #${booking.id}
      Услуга: ${service.name}
      Пользователь: ${user.username}
      Статус: ${oldStatus} → ${newStatus}
    `;

    await bot.sendMessage(chatId, message);
  } catch (error) {
    logger.error('Telegram status update error:', error);
  }
};
