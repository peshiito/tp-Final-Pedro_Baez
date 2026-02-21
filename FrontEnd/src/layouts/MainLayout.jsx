import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <header className="layout-header">
        <div className="header-content">
          <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <h1>🐾 Patitas Felices</h1>
          </div>
          <div className="user-area">
            <span className="user-name">{user?.nombre} {user?.apellido}</span>
            <span className="user-role">{user?.rol}</span>
            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
          </div>
        </div>
      </header>
      
      <div className="layout-body">
        <aside className="layout-sidebar">
          <nav className="sidebar-nav">
            <ul>
              <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Dashboard</a></li>
              {user?.rol === 'ADMIN' && (
                <>
                  <li><a href="/duenos" onClick={(e) => { e.preventDefault(); navigate('/duenos'); }}>Buscar Dueños</a></li>
                  <li><a href="/mascotas" onClick={(e) => { e.preventDefault(); navigate('/mascotas'); }}>Mascotas</a></li>
                </>
              )}
              {user?.rol === 'VETERINARIO' && (
                <li><a href="/mascotas" onClick={(e) => { e.preventDefault(); navigate('/mascotas'); }}>Mascotas</a></li>
              )}
            </ul>
          </nav>
        </aside>
        
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
