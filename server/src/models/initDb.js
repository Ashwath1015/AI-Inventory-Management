const db = require('../config/db');

const initDb = async () => {
  const schema = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) CHECK (role IN ('owner', 'staff')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      stock INTEGER NOT NULL DEFAULT 0,
      reorder_level INTEGER NOT NULL DEFAULT 10,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0.00
    );

    CREATE TABLE IF NOT EXISTS sales (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL,
      sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      unit_price DECIMAL(10, 2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS chat_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id),
      question TEXT NOT NULL,
      function_called VARCHAR(100),
      arguments JSONB,
      response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      delivery_days INTEGER NOT NULL
    );
  `;

  try {
    await db.query('BEGIN');
    await db.query(schema);
    await db.query('COMMIT');
    console.log('Database schema initialized successfully');
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error initializing database schema:', err);
    process.exit(1);
  }
};

module.exports = initDb;
