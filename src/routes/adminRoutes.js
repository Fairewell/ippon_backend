const express = require('express');
const router = express.Router();
const telegramService = require('../services/telegramService');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Обновление Telegram chat_id (только для администраторов)
router.post('/telegram/chat-id', authMiddleware, adminMiddleware, (req, res) => {
  const { chatId } = req.body;
  if (!chatId) {
    return res.status(400).json({ error: 'chatId is required' });
  }
  
  telegramService.setTelegramChatId(chatId);
  res.json({ message: 'Telegram chat ID updated successfully' });
});

module.exports = router;