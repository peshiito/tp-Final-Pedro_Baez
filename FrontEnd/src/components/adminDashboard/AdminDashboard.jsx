import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Administracion</h1>
          <button onClick={logout} className="logout-button">
            Cerrar sesion
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-icon">👋</div>
          <div className="welcome-text">
            <h2>Hola, {user?.nombre} {user?.apellido}</h2>
            <p>Bienvenido al panel de administracion</p>
            <span className="role-badge">Administrador</span>
          </div>
        </div>

        <div className="info-message">
          <p>Panel en construccion - Proximamente mas funcionalidades</p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
