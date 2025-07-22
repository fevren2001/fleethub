import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import MainLayout from '../components/common/MainLayout';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    try {
      await register(form.email, form.password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="register-container" style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 16 }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 16 }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, marginBottom: 16 }}
            />
          </div>
          {error && <div className="error-message" style={{ color: '#b00', marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="submit-button" disabled={isSubmitting} style={{ width: '100%', padding: 12, background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account?{' '}
          <span style={{ color: '#3498db', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register; 