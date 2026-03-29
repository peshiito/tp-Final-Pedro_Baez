import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    mascotas: 0,
    veterinarios: 0,
    duenos: 0,
  });
  const [recientes, setRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Obteniendo datos del dashboard...");

        // Obtener estadísticas manejando diferentes estructuras de respuesta
        const mascotasRes = await api.get("/mascotas");
        const veterinariosRes = await api.get("/veterinarios");
        const duenosRes = await api.get("/duenos");

        console.log("Respuesta mascotas:", mascotasRes.data);
        console.log("Respuesta veterinarios:", veterinariosRes.data);
        console.log("Respuesta dueños:", duenosRes.data);

        // Extraer datos según la estructura de respuesta
        const mascotasCount = Array.isArray(mascotasRes.data)
          ? mascotasRes.data.length
          : mascotasRes.data.mascotas?.length || 0;

        const veterinariosCount = Array.isArray(veterinariosRes.data)
          ? veterinariosRes.data.length
          : veterinariosRes.data?.length || 0;

        const duenosCount = Array.isArray(duenosRes.data)
          ? duenosRes.data.length
          : duenosRes.data?.length || 0;

        setStats({
          mascotas: mascotasCount,
          veterinarios: veterinariosCount,
          duenos: duenosCount,
        });

        // Obtener mascotas recientes
        const mascotasList = Array.isArray(mascotasRes.data)
          ? mascotasRes.data
          : mascotasRes.data.mascotas || [];

        setRecientes(mascotasList.slice(0, 5));
      } catch (error) {
        console.error("Error cargando dashboard:", error);
        setError(
          "Error al cargar los datos. Verifica la conexión con el backend.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para navegar al detalle de mascota
  const verDetalleMascota = (id) => {
    navigate(`/mascotas/${id}`);
  };

  const acciones = [
    {
      icon: "🔍",
      titulo: "Buscar Dueño",
      descripcion: "Buscar dueños por email y ver sus mascotas",
      path: "/duenos",
      color: "primary",
      stats: stats.duenos,
    },
    {
      icon: "🐕",
      titulo: "Nueva Mascota",
      descripcion: "Registrar una nueva mascota",
      path: "/mascotas/nueva",
      color: "secondary",
      stats: stats.mascotas,
    },
    {
      icon: "👤",
      titulo: "Nuevo Dueño",
      descripcion: "Registrar un nuevo dueño",
      path: "/duenos/nuevo",
      color: "primary",
      stats: null,
    },
    {
      icon: "👨‍⚕️",
      titulo: "Nuevo Veterinario",
      descripcion: "Registrar un veterinario",
      path: "/veterinarios/nuevo",
      color: "secondary",
      stats: stats.veterinarios,
    },
  ];

  return (
    <MainLayout>
      <div className="admin-dashboard">
        {/* Header con bienvenida */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h1>
              ¡Bienvenido,{" "}
              <span className="user-name-highlight">{user?.nombre}!</span>
            </h1>
            <p className="welcome-subtitle">
              Panel de Administración •{" "}
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="header-stats">
            <div className="mini-stat">
              <span className="mini-stat-value">{stats.mascotas}</span>
              <span className="mini-stat-label">Mascotas</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{stats.veterinarios}</span>
              <span className="mini-stat-label">Veterinarios</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">{stats.duenos}</span>
              <span className="mini-stat-label">Dueños</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message visible">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="stats-grid">
              <div
                className="stat-card primary"
                onClick={() => navigate("/mascotas")}
                style={{ cursor: "pointer" }}
              >
                <div className="stat-icon">🐕</div>
                <div className="stat-content">
                  <span className="stat-label">Total Mascotas</span>
                  <span className="stat-value">{stats.mascotas}</span>
                </div>
                <div className="stat-trend">
                  {stats.mascotas > 0 ? "📈 Ver todas" : "⏳ Sin datos"}
                </div>
              </div>

              <div className="stat-card success">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-content">
                  <span className="stat-label">Veterinarios</span>
                  <span className="stat-value">{stats.veterinarios}</span>
                </div>
                <div className="stat-trend">
                  {stats.veterinarios > 0 ? "✅ Activos" : "⏳ Sin datos"}
                </div>
              </div>

              <div
                className="stat-card warning"
                onClick={() => navigate("/duenos")}
                style={{ cursor: "pointer" }}
              >
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <span className="stat-label">Dueños</span>
                  <span className="stat-value">{stats.duenos}</span>
                </div>
                <div className="stat-trend">
                  {stats.duenos > 0 ? "📊 Ver todos" : "⏳ Sin datos"}
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="quick-actions-section">
              <h2 className="section-title">Acciones Rápidas</h2>
              <div className="actions-grid">
                {acciones.map((accion, index) => (
                  <div
                    key={index}
                    className={`action-card ${accion.color}`}
                    onClick={() => navigate(accion.path)}
                  >
                    <div className="action-header">
                      <span className="action-icon">{accion.icon}</span>
                      {accion.stats !== null && (
                        <span className="action-badge">{accion.stats}</span>
                      )}
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

            {/* Mascotas recientes */}
            {recientes.length > 0 && (
              <div className="recientes-section">
                <h2 className="section-title">
                  Mascotas Registradas Recientemente
                </h2>
                <div className="recientes-grid">
                  {recientes.map((mascota) => (
                    <div
                      key={mascota.id}
                      className="reciente-card"
                      onClick={() => verDetalleMascota(mascota.id)}
                    >
                      <div className="reciente-icon">
                        {mascota.especie === "Perro"
                          ? "🐕"
                          : mascota.especie === "Gato"
                            ? "🐈"
                            : mascota.especie === "Ave"
                              ? "🦜"
                              : "🐾"}
                      </div>
                      <div className="reciente-info">
                        <h4>{mascota.nombre}</h4>
                        <p>
                          {mascota.especie} • {mascota.raza || "Sin raza"}
                        </p>
                        <small>
                          Dueño: {mascota.dueno_nombre} {mascota.dueno_apellido}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {stats.mascotas === 0 &&
              stats.veterinarios === 0 &&
              stats.duenos === 0 &&
              !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No hay datos disponibles</h3>
                  <p>
                    Comienza registrando tu primer dueño, mascota o veterinario
                  </p>
                  <div className="empty-actions">
                    <button
                      className="btn-primary"
                      onClick={() => navigate("/duenos/nuevo")}
                    >
                      + Nuevo Dueño
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate("/veterinarios/nuevo")}
                    >
                      + Nuevo Veterinario
                    </button>
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
