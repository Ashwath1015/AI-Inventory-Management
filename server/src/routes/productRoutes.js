const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.listProducts);
router.get('/alerts/low-stock', productController.getLowStock);
router.post('/', roleMiddleware('owner'), productController.addProduct);
router.put('/:id', roleMiddleware('owner'), productController.editProduct);
router.delete('/:id', roleMiddleware('owner'), productController.removeProduct);

module.exports = router;
