import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./MascotasAtendidasPage.css";

const MascotasAtendidasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMascotasAtendidas = async () => {
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

        // Obtener todas las consultas del veterinario
        const consultasRes = await api.get(
          `/historial/veterinario/${veterinarioId}`,
        );
        const consultas = consultasRes.data.historial || [];

        // Extraer mascotas únicas
        const mascotasMap = new Map();
        consultas.forEach((consulta) => {
          if (!mascotasMap.has(consulta.mascota_id)) {
            mascotasMap.set(consulta.mascota_id, {
              id: consulta.mascota_id,
              nombre: consulta.mascota_nombre,
              especie: consulta.mascota_especie,
              dueno_nombre: consulta.dueno_nombre,
              dueno_apellido: consulta.dueno_apellido,
              totalConsultas: 1,
              ultimaConsulta: consulta.fecha,
            });
          } else {
            const mascota = mascotasMap.get(consulta.mascota_id);
            mascota.totalConsultas++;
            if (new Date(consulta.fecha) > new Date(mascota.ultimaConsulta)) {
              mascota.ultimaConsulta = consulta.fecha;
            }
          }
        });

        setMascotas(Array.from(mascotasMap.values()));
      } catch (error) {
        console.error("Error cargando mascotas atendidas:", error);
        setError("Error al cargar las mascotas atendidas");
      } finally {
        setLoading(false);
      }
    };

    fetchMascotasAtendidas();
  }, [user]);

  // Filtrar mascotas por nombre o dueño
  const mascotasFiltradas = mascotas.filter(
    (m) =>
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${m.dueno_nombre} ${m.dueno_apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando mascotas atendidas...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mascotas-atendidas-page">
        <div className="page-header">
          <div>
            <h1>Mascotas Atendidas</h1>
            <p className="subtitle">Historial de mascotas que has atendido</p>
          </div>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Volver al Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Buscador */}
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre de mascota o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Estadísticas */}
        <div className="stats-resumen">
          <div className="stat-card">
            <span className="stat-number">{mascotas.length}</span>
            <span className="stat-label">Mascotas diferentes</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {mascotas.reduce((acc, m) => acc + m.totalConsultas, 0)}
            </span>
            <span className="stat-label">Consultas totales</span>
          </div>
        </div>

        {/* Lista de mascotas */}
        {mascotasFiltradas.length === 0 ? (
          <div className="no-mascotas">
            <div className="no-data-icon">🐾</div>
            <h3>No hay mascotas para mostrar</h3>
            <p>
              {searchTerm
                ? "No se encontraron mascotas con esa búsqueda"
                : "Aún no has atendido ninguna mascota"}
            </p>
          </div>
        ) : (
          <div className="mascotas-grid">
            {mascotasFiltradas.map((mascota) => (
              <div
                key={mascota.id}
                className="mascota-card"
                onClick={() => navigate(`/mascotas/${mascota.id}`)}
              >
                <div className="mascota-icon">
                  {mascota.especie === "Perro"
                    ? "🐕"
                    : mascota.especie === "Gato"
                      ? "🐈"
                      : mascota.especie === "Ave"
                        ? "🦜"
                        : "🐾"}
                </div>

                <div className="mascota-info">
                  <h3>{mascota.nombre}</h3>
                  <span className="mascota-especie">{mascota.especie}</span>

                  <div className="dueno-info">
                    <span className="dueno-label">Dueño:</span>
                    <span className="dueno-nombre">
                      {mascota.dueno_nombre} {mascota.dueno_apellido}
                    </span>
                  </div>

                  <div className="consultas-stats">
                    <div className="stat">
                      <span className="stat-valor">
                        {mascota.totalConsultas}
                      </span>
                      <span className="stat-desc">consultas</span>
                    </div>
                    <div className="stat">
                      <span className="stat-valor">
                        {new Date(mascota.ultimaConsulta).toLocaleDateString()}
                      </span>
                      <span className="stat-desc">última</span>
                    </div>
                  </div>
                </div>

                <div className="mascota-footer">
                  <span className="ver-detalle">Ver historial completo →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MascotasAtendidasPage;
