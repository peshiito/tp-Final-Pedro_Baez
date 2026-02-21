import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import "./VeterinarioDashboard.css";

const VeterinarioDashboard = () => {
  const { user } = useAuth();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainLayout>
      <div className="veterinario-dashboard">
        <div className="welcome-section">
          <h1>
            Bienvenido, {user?.nombre} {user?.apellido}
          </h1>
          <p>Panel Veterinario</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Consultas Hoy</h3>
              <p>5</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pendientes</h3>
              <p>3</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Completadas</h3>
              <p>2</p>
            </div>
          </div>
        </div>

        <div className="mascotas-section">
          <h2>Mascotas Atendidas</h2>

          {loading ? (
            <p>Cargando mascotas...</p>
          ) : (
            <div className="mascotas-grid">
              {mascotas.map((mascota) => (
                <div key={mascota.id} className="mascota-card">
                  <h3>{mascota.nombre}</h3>
                  <p>
                    <strong>Especie:</strong> {mascota.especie}
                  </p>
                  <p>
                    <strong>Raza:</strong> {mascota.raza || "No especificada"}
                  </p>
                  <p>
                    <strong>Dueño:</strong> {mascota.dueno_nombre}{" "}
                    {mascota.dueno_apellido}
                  </p>
                  <div className="card-actions">
                    <button className="btn-primary">Ver Historial</button>
                    <button className="btn-secondary">Nueva Consulta</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VeterinarioDashboard;
