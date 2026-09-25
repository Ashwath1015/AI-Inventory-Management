const aiService = require('../services/aiService');

const chat = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;
    const answer = await aiService.processChat(userId, question);
    res.json({ answer });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: 'AI assistant is currently unavailable' });
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await aiService.getChatLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { chat, getLogs };
