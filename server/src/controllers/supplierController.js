const supplierService = require('../services/supplierService');

const getSuppliers = async (req, res) => {
  try {
    const { productId } = req.params;
    const comparison = await supplierService.compareSuppliers(productId);
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const editSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.updateSupplier(req.params.id, req.body);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
    res.json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeSupplier = async (req, res) => {
  try {
    const result = await supplierService.deleteSupplier(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSuppliers, addSupplier, editSupplier, removeSupplier };
