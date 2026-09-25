const express = require('express');
const supplierController = require('../controllers/supplierController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/:productId', supplierController.getSuppliers);
router.post('/', roleMiddleware('owner'), supplierController.addSupplier);
router.put('/:id', roleMiddleware('owner'), supplierController.editSupplier);
router.delete('/:id', roleMiddleware('owner'), supplierController.removeSupplier);

module.exports = router;
