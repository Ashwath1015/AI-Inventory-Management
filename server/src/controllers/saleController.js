const saleService = require('../services/saleService');

const addSale = async (req, res) => {
  try {
    const sale = await saleService.recordSale(req.body);
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalSales = await saleService.getTodaySalesTotal();
    res.json({ todaySalesTotal: totalSales });
  } catch (err) {
    console.error('SALE_CONTROLLER_ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const getTopSellers = async (req, res) => {
  try {
    const { period } = req.query;
    const topSellers = await saleService.getTopSellers(period || 'month');
    res.json(topSellers);
  } catch (err) {
    console.error('SALE_CONTROLLER_ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addSale, getStats, getTopSellers };
