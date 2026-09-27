import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AlertsPanel from '../components/AlertsPanel';
import ChatWidget from '../components/ChatWidget';
import SupplierManager from '../components/SupplierManager';
import { Link } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ todaySalesTotal: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [salesSummary, setSalesSummary] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, statRes, alertRes, topRes] = await Promise.all([
        api.get('/products'),
        api.get('/sales/stats'),
        api.get('/products/alerts/low-stock'),
        api.get('/sales/top-sellers?period=month')
      ]);
      setProducts(prodRes.data);
      setStats(statRes.data);
      setLowStockItems(alertRes.data);
      setTopSellers(topRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.reorder_level && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const getStatus = (product) => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'status-out' };
    if (product.stock <= product.reorder_level) return { label: 'Low Stock', color: 'status-low' };
    return { label: 'Normal', color: 'status-normal' };
  };

  return (
    <div className="dashboard-container">
      <nav className="nav-bar">
        <div className="nav-brand">
          <h1>AI Inventory Assistant</h1>
        </div>
        <div className="nav-actions">
          <div className="nav-links">
             <Link to="/" className="nav-link">Dashboard</Link>
             <Link to="/inventory" className="nav-link">Inventory</Link>
             <Link to="/sales" className="nav-link">Sales</Link>
          </div>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <p className="nav-user-info">Welcome, {user?.name}</p>
          {user.role === 'owner' && (
            <Link to="/audit" className="btn-secondary" style={{ textDecoration: 'none', color: 'var(--apple-text)', fontSize: '0.85rem' }}>
              Audit Logs
            </Link>
          )}
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <h2 className="section-title">Overview</h2>
      </div>

      <AlertsPanel items={lowStockItems} />

      <div className="kpi-grid">
        <div className="kpi-card">
          <h3 className="kpi-title">Total Products</h3>
          <p className="kpi-value">{totalProducts}</p>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-title">Low Stock</h3>
          <p className="kpi-value" style={{ color: '#b76e00' }}>{lowStockCount}</p>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-title">Out of Stock</h3>
          <p className="kpi-value" style={{ color: '#d70015' }}>{outOfStockCount}</p>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-title">Today's Sales</h3>
          <p className="kpi-value">₹{stats.todaySalesTotal}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem', padding: '0 2rem' }}>
        <div style={{ padding: '2rem', borderRadius: '22px', background: 'var(--apple-card-bg)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid var(--apple-border)' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--apple-text)', textAlign: 'center' }}>🏆 Top Sellers (Monthly)</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {topSellers.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '1rem', fontSize: '1.2rem', padding: '1rem 0', borderBottom: '1px solid var(--apple-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--apple-text)' }}>{idx + 1}. <strong style={{ color: '#0071e3' }}>{item.name}</strong></span>
                <span style={{ fontWeight: '600', color: 'var(--apple-text-secondary)' }}>{item.total_sold} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ChatWidget />

      <div className="data-table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Recent Inventory</h2>
          <Link to="/inventory" className="btn-apple" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>View All</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => {
                const status = getStatus(p);
                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.stock}</td>
                    <td>₹{p.price}</td>
                    <td><span className={`status-pill ${status.color}`}>{status.label}</span></td>
                    <td>
                      <button onClick={() => setSelectedProductId(p.id)} className="btn-apple">Suppliers</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProductId && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '90%', maxWidth: '600px', backgroundColor: 'var(--apple-card-bg)', borderRadius: '22px', padding: '1.5rem', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--apple-border)' }}>
            <SupplierManager
              productId={selectedProductId}
              onClose={() => setSelectedProductId(null)}
              onRefresh={fetchData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
