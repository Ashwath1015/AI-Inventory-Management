const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./src/models/initDb');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const supplierRoutes = require('./src/routes/supplierRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize database schema (Disabled to prevent wiping manual data)
// initDb();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/suppliers', supplierRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
