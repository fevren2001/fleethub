// src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/" end>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/drivers">Drivers</NavLink>
        </li>
        <li>
          <NavLink to="/trucks">Trucks</NavLink>
        </li>
        <li>
          <NavLink to="/garages">Garages</NavLink>
        </li>
        <li>
          <NavLink to="/deliveries">Deliveries</NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;