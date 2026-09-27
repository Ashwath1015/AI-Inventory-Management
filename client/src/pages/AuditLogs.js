import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../App.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/ai/logs');
        setLogs(response.data);
      } catch (err) {
        console.error('Error fetching logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--apple-text)' }}>Loading logs...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="section-title">AI Audit Logs</h1>
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Question</th>
              <th>Tool Used</th>
              <th>Response</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.user_name}</td>
                <td>{log.question}</td>
                <td>{log.function_called || 'None'}</td>
                <td>{log.response}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
