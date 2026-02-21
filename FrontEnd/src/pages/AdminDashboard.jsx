import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mascotas: 0,
    veterinarios: 0,
    duenos: 0,
    consultasHoy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener mascotas
        const mascotasRes = await api.get("/mascotas");
        // Obtener veterinarios
        const veterinariosRes = await api.get("/veterinarios");
        // Obtener dueños
        const duenosRes = await api.get("/duenos");

        setStats({
          mascotas: mascotasRes.data.mascotas?.length || 0,
          veterinarios: veterinariosRes.data?.length || 0,
          duenos: duenosRes.data?.length || 0,
          consultasHoy: 0, // Esto lo implementaremos después
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <MainLayout>
      <div className="admin-dashboard">
        <div className="welcome-section">
          <h1>
            Bienvenido, {user?.nombre} {user?.apellido}
          </h1>
          <p>Panel de Administración</p>
        </div>

        {loading ? (
          <p>Cargando estadísticas...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🐕</div>
              <div className="stat-info">
                <h3>Total Mascotas</h3>
                <p>{stats.mascotas}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-info">
                <h3>Veterinarios</h3>
                <p>{stats.veterinarios}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Dueños</h3>
                <p>{stats.duenos}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Consultas Hoy</h3>
                <p>{stats.consultasHoy}</p>
              </div>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate("/duenos")}>
              <div className="action-icon">🔍</div>
              <h3>Buscar Dueño</h3>
              <p>Buscar dueños por email y ver sus mascotas</p>
            </div>

            <div className="action-card">
              <div className="action-icon">➕</div>
              <h3>Nueva Mascota</h3>
              <p>Registrar una nueva mascota</p>
            </div>

            <div className="action-card">
              <div className="action-icon">👨‍⚕️</div>
              <h3>Nuevo Veterinario</h3>
              <p>Registrar un veterinario</p>
            </div>

            <div className="action-card">
              <div className="action-icon">👤</div>
              <h3>Nuevo Dueño</h3>
              <p>Registrar un nuevo dueño</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
