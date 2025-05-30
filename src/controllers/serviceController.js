const Service = require('../models/Service');
const logger = require('../utils/logger'); // Добавлен импорт логгера

// Получение всех услуг
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (error) {
    logger.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to get services' });
  }
};

// Получение услуги по ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    logger.error('Get service by ID error:', error);
    res.status(500).json({ error: 'Failed to get service' });
  }
};

// Создание услуги (только для администраторов)
exports.createService = async (req, res) => {
  try {
    const { name, description, price_per_day } = req.body;
    const service = await Service.create({ name, description, price_per_day });
    res.status(201).json(service);
  } catch (error) {
    logger.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Обновление услуги (только для администраторов)
exports.updateService = async (req, res) => {
  try {
    const { name, description, price_per_day } = req.body;
    const service = await Service.update(req.params.id, { name, description, price_per_day });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    logger.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Удаление услуги (только для администраторов)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.delete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    logger.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

// Проверка доступности услуги на даты
exports.checkAvailability = async (req, res) => {
  try {
    const { serviceId, startDate, endDate } = req.query;
    
    // Здесь будет логика проверки конфликтующих бронирований
    // Пока просто возвращаем true
    res.json({ available: true });
  } catch (error) {
    logger.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
};