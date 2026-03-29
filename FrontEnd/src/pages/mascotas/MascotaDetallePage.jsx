import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import "./MascotaDetallePage.css";

const MascotaDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mascota, setMascota] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchMascotaData = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Cargando mascota ID:", id);

        // Obtener datos de la mascota
        const mascotaRes = await api.get(`/mascotas/${id}`);
        console.log("Respuesta mascota:", mascotaRes.data);

        // La respuesta puede venir en diferentes formatos
        const mascotaData = mascotaRes.data.mascota || mascotaRes.data;
        setMascota(mascotaData);

        // Obtener historial de la mascota
        try {
          const historialRes = await api.get(`/historial/mascota/${id}`);
          console.log("Respuesta historial:", historialRes.data);

          // El historial puede venir en diferentes formatos
          const historialData =
            historialRes.data.historial || historialRes.data || [];
          setHistorial(Array.isArray(historialData) ? historialData : []);
        } catch (historialError) {
          console.log(
            "Error cargando historial (puede no existir aún):",
            historialError,
          );
          setHistorial([]);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("No se pudo cargar la información de la mascota");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMascotaData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "No especificada";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case "CONSULTA":
        return "consulta";
      case "VACUNA":
        return "vacuna";
      case "CIRUGIA":
        return "cirugia";
      case "CONTROL":
        return "control";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mascota-detalle-loading">
          <div className="loading-spinner"></div>
          <p>Cargando información de la mascota...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !mascota) {
    return (
      <MainLayout>
        <div className="mascota-detalle-error">
          <div className="error-icon">😢</div>
          <h2>Oops! Algo salió mal</h2>
          <p>{error || "No se encontró la mascota"}</p>
          <button className="btn-back" onClick={() => navigate("/mascotas")}>
            Volver a Mascotas
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mascota-detalle-page">
        {/* Header con navegación */}
        <div className="detalle-header">
          <button className="btn-back" onClick={() => navigate("/mascotas")}>
            ← Volver a Mascotas
          </button>
          <div className="header-actions">
            {user?.rol === "ADMIN" || user?.rol === "VETERINARIO"}
          </div>
        </div>

        {/* Información principal de la mascota */}
        <div className="mascota-profile">
          <div className="mascota-avatar">
            <span className="avatar-emoji">
              {mascota.especie === "Perro"
                ? "🐕"
                : mascota.especie === "Gato"
                  ? "🐈"
                  : mascota.especie === "Ave"
                    ? "🦜"
                    : "🐾"}
            </span>
          </div>

          <div className="mascota-info-header">
            <h1>{mascota.nombre}</h1>
            <div className="mascota-badges">
              <span className="badge especie">{mascota.especie}</span>
              <span className="badge sexo">{mascota.sexo}</span>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="detalle-tabs">
          <button
            className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            📋 Información General
          </button>
          <button
            className={`tab-btn ${activeTab === "historial" ? "active" : ""}`}
            onClick={() => setActiveTab("historial")}
          >
            📚 Historial Clínico ({historial.length})
          </button>
        </div>

        {/* Contenido de los tabs */}
        <div className="tab-content">
          {activeTab === "info" && (
            <div className="info-tab">
              <div className="info-grid">
                <div className="info-card">
                  <h3>Datos Personales</h3>
                  <div className="info-row">
                    <span className="info-label">Nombre:</span>
                    <span className="info-value">{mascota.nombre}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Especie:</span>
                    <span className="info-value">{mascota.especie}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Raza:</span>
                    <span className="info-value">
                      {mascota.raza || "No especificada"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Sexo:</span>
                    <span className="info-value">{mascota.sexo}</span>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Datos Físicos</h3>
                  <div className="info-row">
                    <span className="info-label">Peso:</span>
                    <span className="info-value">
                      {mascota.peso ? `${mascota.peso} kg` : "No especificado"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Nacimiento:</span>
                    <span className="info-value">
                      {formatDate(mascota.fecha_nacimiento)}
                    </span>
                  </div>
                </div>

                <div className="info-card dueno-card">
                  <h3>Dueño Responsable</h3>
                  <div className="dueno-info-compact">
                    <div className="dueno-avatar">👤</div>
                    <div className="dueno-details">
                      <p className="dueno-nombre">
                        {mascota.dueno_nombre} {mascota.dueno_apellido}
                      </p>
                      <p className="dueno-email">{mascota.dueno_email}</p>
                      {mascota.dueno_telefono && (
                        <p className="dueno-telefono">
                          📞 {mascota.dueno_telefono}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "historial" && (
            <div className="historial-tab">
              <div className="historial-header">
                <h2>Historial Clínico</h2>
                {user?.rol === "ADMIN" || user?.rol === "VETERINARIO"}
              </div>

              {historial.length === 0 ? (
                <div className="no-historial">
                  <div className="no-historial-icon">📭</div>
                  <h3>No hay historial clínico</h3>
                  <p>Este paciente aún no tiene registros médicos</p>
                  {user?.rol === "ADMIN" || user?.rol === "VETERINARIO"}
                </div>
              ) : (
                <div className="historial-timeline">
                  {historial.map((entry, index) => (
                    <div key={entry.id} className="timeline-entry">
                      <div className="timeline-marker">
                        <div
                          className={`marker-dot ${getTipoColor(entry.tipo)}`}
                        ></div>
                        {index < historial.length - 1 && (
                          <div className="marker-line"></div>
                        )}
                      </div>

                      <div className="entry-card">
                        <div className="entry-header">
                          <div className="entry-date">
                            {new Date(entry.fecha).toLocaleDateString("es-ES")}
                          </div>
                          <div
                            className={`entry-type ${getTipoColor(entry.tipo)}`}
                          >
                            {entry.tipo}
                          </div>
                        </div>

                        <div className="entry-body">
                          <div className="entry-vet">
                            <span className="vet-label">Atendió:</span>
                            <span className="vet-name">
                              {entry.veterinario_nombre}{" "}
                              {entry.veterinario_apellido}
                            </span>
                          </div>

                          <div className="entry-diagnostico">
                            <h4>Diagnóstico</h4>
                            <p>{entry.diagnostico}</p>
                          </div>

                          {entry.tratamiento && (
                            <div className="entry-tratamiento">
                              <h4>Tratamiento</h4>
                              <p>{entry.tratamiento}</p>
                            </div>
                          )}

                          {entry.observaciones && (
                            <div className="entry-observaciones">
                              <h4>Observaciones</h4>
                              <p>{entry.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MascotaDetallePage;
