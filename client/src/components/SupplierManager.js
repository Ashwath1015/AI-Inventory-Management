import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../App.css';

const SupplierManager = ({ productId, onClose, onRefresh }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState({ name: '', price: '', delivery_days: '' });

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/suppliers/${productId}`);
      const allSuppliers = Array.from(new Set([...response.data.cheapest, ...response.data.fastest]))
        .map(s => ({ ...s }));
      setSuppliers(allSuppliers);
    } catch (err) {
      alert('Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [productId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', { ...newSupplier, product_id: productId });
      setNewSupplier({ name: '', price: '', delivery_days: '' });
      await fetchSuppliers();
      onRefresh();
    } catch (err) {
      alert('Error adding supplier');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      await fetchSuppliers();
    } catch (err) {
      alert('Error deleting supplier');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--apple-text)' }}>Loading suppliers...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: 'var(--apple-text)' }}>Manage Suppliers</h3>
        <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem 1rem' }}>Close</button>
      </div>

      <form onSubmit={handleAdd} style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--apple-bg)', border: '1px solid var(--apple-border)' }}>
        <h4 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', color: 'var(--apple-text)' }}>Add New Supplier</h4>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            className="btn-secondary"
            style={{ flex: 2, padding: '0.6rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--apple-border)', backgroundColor: 'var(--apple-card-bg)', color: 'var(--apple-text)' }}
            placeholder="Name"
            value={newSupplier.name}
            onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
            required
          />
          <input
            className="btn-secondary"
            style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--apple-border)', backgroundColor: 'var(--apple-card-bg)', color: 'var(--apple-text)' }}
            placeholder="Price"
            type="number"
            step="0.01"
            value={newSupplier.price}
            onChange={e => setNewSupplier({...newSupplier, price: e.target.value})}
            required
          />
          <input
            className="btn-secondary"
            style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-pill)', border: '1px solid var(--apple-border)', backgroundColor: 'var(--apple-card-bg)', color: 'var(--apple-text)' }}
            placeholder="Days"
            type="number"
            value={newSupplier.delivery_days}
            onChange={e => setNewSupplier({...newSupplier, delivery_days: e.target.value})}
            required
          />
          <button type="submit" className="btn-apple">Add</button>
        </div>
      </form>

      <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--apple-text)' }}>Current Suppliers</h4>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Delivery</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>₹{s.price}</td>
              <td>{s.delivery_days} days</td>
              <td>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="btn-secondary"
                  style={{ color: '#d70015', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierManager;
