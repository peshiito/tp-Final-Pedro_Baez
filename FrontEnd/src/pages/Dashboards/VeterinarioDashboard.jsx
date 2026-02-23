import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./VeterinarioDashboard.css";

const VeterinarioDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    consultasHoy: 0,
    consultasSemana: 0,
    mascotasAtendidas: 0,
  });
  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [emailBusqueda, setEmailBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const fetchVeterinarioData = async () => {
      try {
        setLoading(true);

        console.log("Usuario desde useAuth:", user);

        // Obtener el usuario del localStorage como respaldo
        const userStr = localStorage.getItem("user");
        let currentUser = user;

        if (!currentUser && userStr) {
          currentUser = JSON.parse(userStr);
          console.log("Usuario desde localStorage:", currentUser);
        }

        if (!currentUser) {
          console.error("No hay usuario logueado");
          setLoading(false);
          return;
        }

        // Intentar obtener el perfilId del usuario
        let veterinarioId = currentUser.perfilId;
        console.log("perfilId del usuario:", veterinarioId);

        // Si no hay perfilId, buscamos por email
        if (!veterinarioId) {
          console.log("Buscando veterinario por email:", currentUser.email);

          try {
            // Intentamos obtener el veterinario por email
            const veterinarioRes = await api.get(
              `/veterinarios/email/${currentUser.email}`,
            );
            if (veterinarioRes.data) {
              veterinarioId = veterinarioRes.data.id;
              console.log(
                "Veterinario encontrado por email:",
                veterinarioRes.data,
              );
            }
          } catch (err) {
            console.log(
              "No se pudo obtener veterinario por email:",
              err.message,
            );
          }
        }

        // Si aún no hay ID, buscamos en la lista de veterinarios
        if (!veterinarioId) {
          console.log("Buscando en lista de veterinarios...");
          try {
            const veterinariosRes = await api.get("/veterinarios");
            const veterinarios = veterinariosRes.data || [];

            const veterinarioEncontrado = veterinarios.find(
              (vet) => vet.email === currentUser.email,
            );

            if (veterinarioEncontrado) {
              veterinarioId = veterinarioEncontrado.id;
              console.log(
                "Veterinario encontrado en lista:",
                veterinarioEncontrado,
              );
            }
          } catch (err) {
            console.log("Error obteniendo lista de veterinarios:", err.message);
          }
        }

        if (!veterinarioId) {
          console.error("No se pudo encontrar el ID del veterinario");
          setLoading(false);
          return;
        }

        console.log("Veterinario ID final:", veterinarioId);

        // Obtener historial del veterinario
        const historialRes = await api.get(
          `/historial/veterinario/${veterinarioId}`,
        );
        console.log("Historial recibido:", historialRes.data);

        const consultas = historialRes.data.historial || [];

        // Calcular consultas de hoy
        const hoy = new Date().toDateString();
        const consultasHoy = consultas.filter(
          (c) => new Date(c.fecha).toDateString() === hoy,
        ).length;

        // Calcular consultas de la semana
        const semana = new Date();
        semana.setDate(semana.getDate() - 7);
        const consultasSemana = consultas.filter(
          (c) => new Date(c.fecha) >= semana,
        ).length;

        setStats({
          consultasHoy,
          consultasSemana,
          mascotasAtendidas: consultas.length,
        });

        // Últimas 5 consultas
        setUltimasConsultas(consultas.slice(0, 5));
      } catch (error) {
        console.error("Error cargando datos del veterinario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarioData();
  }, [user]);

  const handleBuscarDueno = async (e) => {
    e.preventDefault();
    if (!emailBusqueda.trim()) return;

    setBuscando(true);
    try {
      navigate(`/duenos?email=${encodeURIComponent(emailBusqueda)}`);
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setBuscando(false);
    }
  };

  const acciones = [
    {
      icon: "➕",
      titulo: "Iniciar Consulta",
      descripcion: "Registrar una nueva consulta médica",
      path: "/consulta/nueva",
      color: "secondary",
      accion: "consulta",
    },
    {
      icon: "📋",
      titulo: "Mis Consultas",
      descripcion: "Ver todas las consultas que he realizado",
      path: "/mis-consultas",
      color: "primary",
      accion: "ver",
    },
    {
      icon: "🐕",
      titulo: "Mascotas Atendidas",
      descripcion: "Lista de todas las mascotas que he atendido",
      path: "/mascotas-atendidas",
      color: "secondary",
      accion: "ver",
    },
  ];

  return (
    <MainLayout>
      <div className="veterinario-dashboard">
        {/* Header con bienvenida personalizada */}
        <div className="welcome-header">
          <div className="welcome-text">
            <h1>
              ¡Hola,{" "}
              <span className="user-name-highlight">
                Dr. {user?.apellido || "Veterinario"}!
              </span>
            </h1>
            <p className="welcome-subtitle">
              Panel Veterinario •{" "}
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Buscador rápido de dueño */}
          <form onSubmit={handleBuscarDueno} className="quick-search">
            <input
              type="email"
              placeholder="Buscar dueño por email..."
              value={emailBusqueda}
              onChange={(e) => setEmailBusqueda(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={buscando}>
              {buscando ? "..." : "🔍"}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando tu panel...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de estadísticas personalizadas */}
            <div className="stats-grid">
              <div className="stat-card today">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <span className="stat-label">Consultas de Hoy</span>
                  <span className="stat-value">{stats.consultasHoy}</span>
                </div>
                <div className="stat-trend">
                  {stats.consultasHoy > 0 ? "🟢 Activo" : "⚪ Sin consultas"}
                </div>
              </div>

              <div className="stat-card week">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-label">Esta Semana</span>
                  <span className="stat-value">{stats.consultasSemana}</span>
                </div>
                <div className="stat-trend">
                  {stats.consultasSemana > 0
                    ? "📈 " + stats.consultasSemana
                    : "📉 0"}
                </div>
              </div>

              <div className="stat-card total">
                <div className="stat-icon">🐾</div>
                <div className="stat-content">
                  <span className="stat-label">Mascotas Atendidas</span>
                  <span className="stat-value">{stats.mascotasAtendidas}</span>
                </div>
                <div className="stat-trend">Total histórico</div>
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
                    </div>
                    <h3 className="action-title">{accion.titulo}</h3>
                    <p className="action-description">{accion.descripcion}</p>
                    <div className="action-footer">
                      <span className="action-link">Iniciar →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Últimas consultas realizadas */}
            {ultimasConsultas.length > 0 && (
              <div className="recientes-section">
                <h2 className="section-title">Tus Últimas Consultas</h2>
                <div className="consultas-list">
                  {ultimasConsultas.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="consulta-card"
                      onClick={() =>
                        navigate(`/mascotas/${consulta.mascota_id}`)
                      }
                    >
                      <div className="consulta-header">
                        <span className="consulta-fecha">
                          {new Date(consulta.fecha).toLocaleDateString()}
                        </span>
                        <span
                          className={`consulta-tipo ${consulta.tipo?.toLowerCase()}`}
                        >
                          {consulta.tipo}
                        </span>
                      </div>
                      <div className="consulta-body">
                        <div className="mascota-info">
                          <strong>{consulta.mascota_nombre}</strong>
                          <span>{consulta.mascota_especie}</span>
                        </div>
                        <div className="dueno-info">
                          <small>
                            Dueño: {consulta.dueno_nombre}{" "}
                            {consulta.dueno_apellido}
                          </small>
                        </div>
                        <p className="consulta-diagnostico">
                          {consulta.diagnostico.substring(0, 60)}...
                        </p>
                      </div>
                      <div className="consulta-footer">
                        <span className="ver-detalle">Ver detalle →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default VeterinarioDashboard;
