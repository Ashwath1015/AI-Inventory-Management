const db = require('../config/db');

const getAllProducts = async () => {
  const result = await db.query('SELECT * FROM products');
  return result.rows;
};

const getLowStockItems = async () => {
  const result = await db.query(
    'SELECT *, (reorder_level - stock) as shortage FROM products WHERE stock <= reorder_level ORDER BY shortage DESC'
  );
  return result.rows;
};

const createProduct = async (productData) => {
  const { name, category, stock, reorder_level, price } = productData;
  const result = await db.query(
    'INSERT INTO products (name, category, stock, reorder_level, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, category, stock, reorder_level, price]
  );
  return result.rows[0];
};

const updateProduct = async (id, productData) => {
  const { name, category, stock, reorder_level, price } = productData;
  const result = await db.query(
    'UPDATE products SET name = $1, category = $2, stock = $3, reorder_level = $4, price = $5 WHERE id = $6 RETURNING *',
    [name, category, stock, reorder_level, price, id]
  );
  return result.rows[0];
};

const deleteProduct = async (id) => {
  await db.query('DELETE FROM products WHERE id = $1', [id]);
  return { message: 'Product deleted successfully' };
};

module.exports = { getAllProducts, getLowStockItems, createProduct, updateProduct, deleteProduct };
