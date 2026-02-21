import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './VeterinarioDashboard.css';

const VeterinarioDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="veterinario-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panel Veterinario</h1>
          <button onClick={logout} className="logout-button">
            Cerrar sesion
          </button>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="welcome-icon">🩺</div>
          <div className="welcome-text">
            <h2>Hola, {user?.nombre} {user?.apellido}</h2>
            <p>Bienvenido al panel veterinario</p>
            <span className="role-badge vet">Veterinario</span>
          </div>
        </div>

        <div className="info-message">
          <p>Panel en construccion - Proximamente podras gestionar mascotas e historiales clinicos</p>
        </div>
      </main>
    </div>
  );
};

export default VeterinarioDashboard;
