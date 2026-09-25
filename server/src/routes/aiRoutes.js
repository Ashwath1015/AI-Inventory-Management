const express = require('express');
const aiController = require('../controllers/aiController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/chat', aiController.chat);
router.get('/logs', roleMiddleware('owner'), aiController.getLogs);

module.exports = router;
