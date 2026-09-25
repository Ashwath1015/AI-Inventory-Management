const db = require('../config/db');

const getSuppliersByProduct = async (productId) => {
  const result = await db.query('SELECT * FROM suppliers WHERE product_id = $1', [productId]);
  return result.rows;
};

const createSupplier = async (supplierData) => {
  const { product_id, name, price, delivery_days } = supplierData;
  const result = await db.query(
    'INSERT INTO suppliers (product_id, name, price, delivery_days) VALUES ($1, $2, $3, $4) RETURNING *',
    [product_id, name, price, delivery_days]
  );
  return result.rows[0];
};

const updateSupplier = async (id, supplierData) => {
  const { name, price, delivery_days } = supplierData;
  const result = await db.query(
    'UPDATE suppliers SET name = $1, price = $2, delivery_days = $3 WHERE id = $4 RETURNING *',
    [name, price, delivery_days, id]
  );
  return result.rows[0];
};

const deleteSupplier = async (id) => {
  await db.query('DELETE FROM suppliers WHERE id = $1', [id]);
  return { message: 'Supplier deleted successfully' };
};

const compareSuppliers = async (productId) => {
  const suppliers = await getSuppliersByProduct(productId);
  if (suppliers.length === 0) return { cheapest: [], fastest: [] };

  const cheapest = [...suppliers].sort((a, b) => a.price - b.price);
  const fastest = [...suppliers].sort((a, b) => a.delivery_days - b.delivery_days);

  return { cheapest, fastest };
};

module.exports = { getSuppliersByProduct, createSupplier, updateSupplier, deleteSupplier, compareSuppliers };
