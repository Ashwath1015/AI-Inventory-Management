import React from 'react';
import '../App.css';

const AlertsPanel = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: 'var(--radius-lg)',
      backgroundColor: 'var(--apple-card-bg)',
      border: '1px solid var(--apple-border)',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
    }}>
      <h3 style={{ color: '#d70015', marginTop: 0, fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>⚠️ Low Stock Alerts</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{
            marginBottom: '0.8rem',
            fontSize: '1rem',
            color: 'var(--apple-text)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0',
            borderBottom: '1px solid var(--apple-border)'
          }}>
            <span>
              <strong style={{ color: '#0071e3' }}>{item.name}</strong>: {item.stock} left (Threshold: {item.reorder_level})
            </span>
            <span style={{ color: '#d70015', fontWeight: '600', fontSize: '0.9rem' }}>
              Shortage: {item.shortage} units
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsPanel;
