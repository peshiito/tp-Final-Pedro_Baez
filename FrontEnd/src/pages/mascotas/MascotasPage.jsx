import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./MascotasPage.css";

const MascotasPage = () => {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await api.get("/mascotas");
        setMascotas(response.data.mascotas || []);
      } catch (error) {
        console.error("Error cargando mascotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const mascotasFiltradas = mascotas.filter(
    (mascota) =>
      mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${mascota.dueno_nombre} ${mascota.dueno_apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleVerMascota = (id) => {
    navigate(`/mascotas/${id}`);
  };

  return (
    <MainLayout>
      <div className="mascotas-page">
        <div className="page-header">
          <h1>Mascotas</h1>
          <button
            className="btn-primary"
            onClick={() => navigate("/mascotas/nueva")}
          >
            + Nueva Mascota
          </button>
        </div>

        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre de mascota o dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="loading-message">Cargando mascotas...</p>
        ) : (
          <div className="mascotas-table-container">
            <table className="mascotas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                  <th>Raza</th>
                  <th>Sexo</th>
                  <th>Dueño</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mascotasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No se encontraron mascotas
                    </td>
                  </tr>
                ) : (
                  mascotasFiltradas.map((mascota) => (
                    <tr key={mascota.id}>
                      <td>{mascota.id}</td>
                      <td>
                        <span
                          className="nombre-link"
                          onClick={() => handleVerMascota(mascota.id)}
                        >
                          {mascota.nombre}
                        </span>
                      </td>
                      <td>{mascota.especie}</td>
                      <td>{mascota.raza || "-"}</td>
                      <td>{mascota.sexo}</td>
                      <td>
                        {mascota.dueno_nombre} {mascota.dueno_apellido}
                      </td>
                      <td>
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleVerMascota(mascota.id)}
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MascotasPage;
