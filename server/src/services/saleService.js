const db = require('../config/db');

const recordSale = async (saleData) => {
  const { product_id, quantity, unit_price } = saleData;

  // Transaction to ensure atomicity: record sale AND update stock
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check stock
    const stockCheck = await client.query('SELECT stock FROM products WHERE id = $1 FOR UPDATE', [product_id]);
    if (stockCheck.rows.length === 0) throw new Error('Product not found');
    if (stockCheck.rows[0].stock < quantity) throw new Error('Insufficient stock');

    // 2. Record sale
    const saleResult = await client.query(
      'INSERT INTO sales (product_id, quantity, unit_price) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, unit_price]
    );

    // 3. Update stock
    await client.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [quantity, product_id]
    );

    await client.query('COMMIT');
    return saleResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getTodaySalesTotal = async () => {
  const result = await db.query(
    "SELECT SUM(quantity * unit_price) as total FROM sales WHERE sale_date >= CURRENT_DATE"
  );
  return result.rows[0].total || 0;
};

const getSalesSummary = async () => {
  const query = `
    SELECT
      COUNT(*) as total_transactions,
      SUM(quantity) as total_items_sold,
      SUM(quantity * unit_price) as total_revenue
    FROM sales
  `;
  const result = await db.query(query);
  return result.rows[0];
};

const getTopSellers = async (period = 'month') => {
  let dateTrunc = 'month';
  if (period === 'day') dateTrunc = 'day';
  if (period === 'week') dateTrunc = 'week';

  const query = `
    SELECT p.name, SUM(s.quantity) as total_sold
    FROM sales s
    JOIN products p ON s.product_id = p.id
    WHERE s.sale_date >= date_trunc($1, CURRENT_DATE)
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT 5
  `;
  const result = await db.query(query, [dateTrunc]);
  return result.rows;
};

module.exports = { recordSale, getTodaySalesTotal, getSalesSummary, getTopSellers };
