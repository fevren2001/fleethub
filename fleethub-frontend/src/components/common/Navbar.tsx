// src/components/common/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">FleetHub</Link>
      </div>
      
      <div className="navbar-menu">
        {user && (
          <div className="user-menu">
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;