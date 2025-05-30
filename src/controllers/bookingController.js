const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Cart = require('../models/Cart'); // Предположим, что модель Cart уже создана
const telegramService = require('../services/telegramService');
const logger = require('../utils/logger'); // Добавлен импорт логгера

// Создание бронирования
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Проверка доступности услуги
    const isAvailable = await Booking.checkAvailability(serviceId, startDate, endDate);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Service not available for selected dates' });
    }

    // Получение информации об услуге
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Расчет стоимости
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const totalPrice = service.price_per_day * days;

    // Создание бронирования
    const booking = await Booking.create({
      userId,
      serviceId,
      startDate,
      endDate,
      totalPrice
    });

    // Отправка уведомления в Telegram
    await telegramService.sendNewBookingNotification(booking.id);

    res.status(201).json(booking);
  } catch (error) {
    logger.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// Получение бронирований пользователя
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUserId(req.user.id);
    res.json(bookings);
  } catch (error) {
    logger.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
};

// Обновление статуса бронирования (для администратора)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    // Получаем текущий статус для отправки уведомления
    const currentBooking = await Booking.findById(bookingId);
    if (!currentBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = await Booking.updateStatus(bookingId, status);
    
    // Отправляем уведомление об изменении статуса
    await telegramService.sendBookingStatusUpdate(bookingId, currentBooking.status, status);

    res.json(booking);
  } catch (error) {
    logger.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Оформление бронирования из корзины
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Получаем корзину пользователя
    const cart = await Cart.findByUserId(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const bookings = [];

    // Для каждого элемента корзины создаем бронирование
    for (const item of cart.items) {
      const isAvailable = await Booking.checkAvailability(item.serviceId, item.startDate, item.endDate);
      if (!isAvailable) {
        return res.status(400).json({ 
          error: `Service ${item.serviceId} not available for selected dates`
        });
      }

      const service = await Service.findById(item.serviceId);
      const days = Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24));
      const totalPrice = service.price_per_day * days;

      const booking = await Booking.create({
        userId,
        serviceId: item.serviceId,
        startDate: item.startDate,
        endDate: item.endDate,
        totalPrice
      });

      bookings.push(booking);
      await telegramService.sendNewBookingNotification(booking.id);
    }

    // Очищаем корзину после оформления
    await Cart.clear(userId);

    res.status(201).json(bookings);
  } catch (error) {
    logger.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};