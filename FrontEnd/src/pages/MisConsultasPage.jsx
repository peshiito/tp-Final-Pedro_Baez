import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./MisConsultasPage.css";

const MisConsultasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todas"); // 'todas', 'hoy', 'semana', 'mes'

  useEffect(() => {
    const fetchMisConsultas = async () => {
      try {
        setLoading(true);

        // Obtener el ID del veterinario
        const userStr = localStorage.getItem("user");
        const currentUser = userStr ? JSON.parse(userStr) : user;
        let veterinarioId = currentUser.perfilId;

        if (!veterinarioId) {
          const veterinarioRes = await api.get(
            `/veterinarios/email/${currentUser.email}`,
          );
          veterinarioId = veterinarioRes.data.id;
        }

        // Obtener consultas del veterinario
        const response = await api.get(
          `/historial/veterinario/${veterinarioId}`,
        );
        setConsultas(response.data.historial || []);
      } catch (error) {
        console.error("Error cargando consultas:", error);
        setError("Error al cargar las consultas");
      } finally {
        setLoading(false);
      }
    };

    fetchMisConsultas();
  }, [user]);

  // Filtrar consultas según la opción seleccionada
  const filtrarConsultas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const semana = new Date();
    semana.setDate(semana.getDate() - 7);

    const mes = new Date();
    mes.setMonth(mes.getMonth() - 1);

    return consultas.filter((consulta) => {
      const fechaConsulta = new Date(consulta.fecha);

      switch (filtro) {
        case "hoy":
          return fechaConsulta >= hoy;
        case "semana":
          return fechaConsulta >= semana;
        case "mes":
          return fechaConsulta >= mes;
        default:
          return true;
      }
    });
  };

  const consultasFiltradas = filtrarConsultas();

  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "consulta":
        return "consulta";
      case "vacuna":
        return "vacuna";
      case "cirugia":
        return "cirugia";
      case "control":
        return "control";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando tus consultas...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mis-consultas-page">
        <div className="page-header">
          <div>
            <h1>Mis Consultas</h1>
            <p className="subtitle">Historial de consultas realizadas</p>
          </div>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Volver al Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Filtros */}
        <div className="filtros-section">
          <button
            className={`filtro-btn ${filtro === "todas" ? "active" : ""}`}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>
          <button
            className={`filtro-btn ${filtro === "hoy" ? "active" : ""}`}
            onClick={() => setFiltro("hoy")}
          >
            Hoy
          </button>
          <button
            className={`filtro-btn ${filtro === "semana" ? "active" : ""}`}
            onClick={() => setFiltro("semana")}
          >
            Última semana
          </button>
          <button
            className={`filtro-btn ${filtro === "mes" ? "active" : ""}`}
            onClick={() => setFiltro("mes")}
          >
            Último mes
          </button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-pequeñas">
          <div className="stat-item">
            <span className="stat-valor">{consultas.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-valor">{consultasFiltradas.length}</span>
            <span className="stat-label">Filtradas</span>
          </div>
        </div>

        {/* Lista de consultas */}
        {consultasFiltradas.length === 0 ? (
          <div className="no-consultas">
            <div className="no-data-icon">📋</div>
            <h3>No hay consultas para mostrar</h3>
            <p>No se encontraron consultas con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="consultas-grid">
            {consultasFiltradas.map((consulta) => (
              <div
                key={consulta.id}
                className="consulta-card"
                onClick={() => navigate(`/mascotas/${consulta.mascota_id}`)}
              >
                <div className="consulta-header">
                  <span className="consulta-fecha">
                    {new Date(consulta.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={`consulta-tipo ${getTipoColor(consulta.tipo)}`}
                  >
                    {consulta.tipo}
                  </span>
                </div>

                <div className="consulta-body">
                  <div className="mascota-info">
                    <h3>{consulta.mascota_nombre}</h3>
                    <span className="mascota-especie">
                      {consulta.mascota_especie}
                    </span>
                  </div>

                  <div className="dueno-info">
                    <span className="dueno-label">Dueño:</span>
                    <span className="dueno-nombre">
                      {consulta.dueno_nombre} {consulta.dueno_apellido}
                    </span>
                  </div>

                  <div className="diagnostico-preview">
                    <strong>Diagnóstico:</strong>
                    <p>{consulta.diagnostico.substring(0, 100)}...</p>
                  </div>

                  {consulta.tratamiento && (
                    <div className="tratamiento-preview">
                      <strong>Tratamiento:</strong>
                      <p>{consulta.tratamiento.substring(0, 80)}...</p>
                    </div>
                  )}
                </div>

                <div className="consulta-footer">
                  <span className="ver-detalle">Ver detalle completo →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MisConsultasPage;
