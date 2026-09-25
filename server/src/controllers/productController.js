const productService = require('../services/productService');

const listProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('PRODUCT_CONTROLLER_ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const items = await productService.getLowStockItems();
    res.json(items);
  } catch (err) {
    console.error('PRODUCT_CONTROLLER_ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('PRODUCT_CONTROLLER_ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listProducts, getLowStock, addProduct, editProduct, removeProduct };
