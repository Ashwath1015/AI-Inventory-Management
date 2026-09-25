const express = require('express');
const saleController = require('../controllers/saleController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/', saleController.addSale);
router.get('/stats', saleController.getStats);
router.get('/top-sellers', saleController.getTopSellers);

module.exports = router;
