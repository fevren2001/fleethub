// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login to FleetHub</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Don't have an account?{' '}
          <span style={{ color: '#3498db', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            style={{ background: '#22c55e', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 16, cursor: 'pointer' }}
            onClick={async () => {
              setError('');
              try {
                await login('mail@mail.com', 'supersecret');
                navigate('/');
              } catch (err: any) {
                setError('Demo login failed');
              }
            }}
          >
            Demo Login (mail@mail.com / supersecret)
          </button>
          <div style={{ color: '#888', fontSize: 14, marginTop: 8 }}>
            <strong>Don't want to sign up?</strong> Use this demo account!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;