import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Use the top-sellers endpoint to get product names and quantities
        const res = await api.get('/sales/top-sellers?period=month');
        setSales(res.data);
      } catch (err) {
        console.error('Error fetching sales', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading sales...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="section-title">Sales Reports</h2>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Period</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, idx) => (
              <tr key={idx}>
                <td>{sale.name}</td>
                <td>{sale.total_sold}</td>
                <td>Monthly</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
