import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Register</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name: </label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email: </label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password: </label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Role: </label>
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="staff">Staff</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};

export default Register;
