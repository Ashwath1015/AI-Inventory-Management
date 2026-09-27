import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  if (!data || data.length === 0) return <div style={{ height: '300px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86868b' }}>No sales data available for the selected period</div>;

  return (
    <div style={{ height: '300px', width: '100%', padding: '1rem', borderRadius: '22px', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)' }}>
      <h3 style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1d1d1f' }}>Sales Trend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f7" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#86868b' }}
            tickFormatter={formatDate}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#86868b' }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(value) => [`₹${value}`, 'Revenue']}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#0071e3"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0071e3' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
