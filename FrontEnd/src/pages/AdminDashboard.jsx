import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mascotas: 0,
    veterinarios: 0,
    duenos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mascotasRes, veterinariosRes, duenosRes] = await Promise.all([
          api.get('/mascotas'),
          api.get('/veterinarios'),
          api.get('/duenos')
        ]);
        
        setStats({
          mascotas: mascotasRes.data.mascotas?.length || 0,
          veterinarios: veterinariosRes.data?.length || 0,
          duenos: duenosRes.data?.length || 0
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const acciones = [
    {
      icon: '🔍',
      titulo: 'Buscar Dueño',
      descripcion: 'Buscar dueños por email y ver sus mascotas',
      path: '/duenos',
      color: 'primary'
    },
    {
      icon: '🐕',
      titulo: 'Nueva Mascota',
      descripcion: 'Registrar una nueva mascota',
      path: '/mascotas/nueva',
      color: 'secondary'
    },
    {
      icon: '👤',
      titulo: 'Nuevo Dueño',
      descripcion: 'Registrar un nuevo dueño',
      path: '/duenos/nuevo',
      color: 'primary'
    },
    {
      icon: '👨‍⚕️',
      titulo: 'Nuevo Veterinario',
      descripcion: 'Registrar un veterinario',
      path: '/veterinarios/nuevo',
      color: 'secondary'
    }
  ];

  return (
    <MainLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Panel de Administración</h1>
            <p className="dashboard-subtitle">
              Bienvenido de vuelta, <span className="highlight">{user?.nombre} {user?.apellido}</span>
            </p>
          </div>
          <div className="date-badge">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {loading ? (
          <div className="stats-loading">Cargando estadísticas...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card mascotas">
              <div className="stat-icon">🐕</div>
              <div className="stat-content">
                <span className="stat-label">Total Mascotas</span>
                <span className="stat-value">{stats.mascotas}</span>
              </div>
            </div>

            <div className="stat-card veterinarios">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-content">
                <span className="stat-label">Veterinarios</span>
                <span className="stat-value">{stats.veterinarios}</span>
              </div>
            </div>

            <div className="stat-card duenos">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <span className="stat-label">Dueños</span>
                <span className="stat-value">{stats.duenos}</span>
              </div>
            </div>
          </div>
        )}

        <div className="quick-actions-section">
          <h2 className="section-title">Acciones Rápidas</h2>
          <div className="actions-grid">
            {acciones.map((accion, index) => (
              <div
                key={index}
                className={`action-card ${accion.color}`}
                onClick={() => navigate(accion.path)}
              >
                <div className="action-icon-wrapper">
                  <span className="action-icon">{accion.icon}</span>
                </div>
                <h3 className="action-title">{accion.titulo}</h3>
                <p className="action-description">{accion.descripcion}</p>
                <div className="action-footer">
                  <span className="action-link">Ir →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
