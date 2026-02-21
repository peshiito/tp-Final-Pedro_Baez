import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import "./DuenosPage.css";

const DuenosPage = () => {
  const [email, setEmail] = useState("");
  const [dueno, setDueno] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const buscarDueno = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Ingrese un email para buscar");
      return;
    }

    setLoading(true);
    setError("");
    setDueno(null);
    setMascotas([]);
    setBusquedaRealizada(true);

    try {
      // Buscar usuario por email
      const usuariosResponse = await api.get(`/usuarios?email=${email}`);
      const usuarios = usuariosResponse.data || [];

      // Filtrar por email exacto y rol DUENO (rol_id = 3)
      const usuarioEncontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.rol_id === 3,
      );

      if (!usuarioEncontrado) {
        setError("No se encontró un dueño con ese email");
        setLoading(false);
        return;
      }

      // Buscar el perfil de dueño asociado
      const duenosResponse = await api.get(
        `/duenos/usuario/${usuarioEncontrado.id}`,
      );

      if (!duenosResponse.data) {
        setError("El usuario existe pero no tiene perfil de dueño");
        setLoading(false);
        return;
      }

      const duenoData = duenosResponse.data;

      // Combinar datos
      const duenoCompleto = {
        ...duenoData,
        nombre: usuarioEncontrado.nombre,
        apellido: usuarioEncontrado.apellido,
        email: usuarioEncontrado.email,
        direccion: usuarioEncontrado.direccion,
      };

      setDueno(duenoCompleto);

      // Buscar mascotas del dueño
      const mascotasResponse = await api.get(`/mascotas/dueno/${duenoData.id}`);
      setMascotas(mascotasResponse.data.mascotas || []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setError("Error al buscar el dueño");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="duenos-page">
        <div className="page-header">
          <h1>Buscar Dueño por Email</h1>
        </div>

        <div className="search-section">
          <form onSubmit={buscarDueno} className="search-form">
            <div className="search-input-group">
              <input
                type="email"
                className="search-input"
                placeholder="Ingrese email del dueño..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="search-button"
                disabled={loading}
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {busquedaRealizada && !loading && !error && !dueno && (
          <div className="no-results">No se encontraron resultados</div>
        )}

        {dueno && (
          <div className="results-section">
            <div className="dueno-card">
              <h2>Datos del Dueño</h2>
              <div className="dueno-info">
                <p>
                  <strong>Nombre:</strong> {dueno.nombre} {dueno.apellido}
                </p>
                <p>
                  <strong>Email:</strong> {dueno.email}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  {dueno.telefono || "No especificado"}
                </p>
                <p>
                  <strong>DNI:</strong> {dueno.dni || "No especificado"}
                </p>
                <p>
                  <strong>Dirección:</strong>{" "}
                  {dueno.direccion || "No especificada"}
                </p>
              </div>
            </div>

            <div className="mascotas-section">
              <h2>Mascotas de {dueno.nombre}</h2>

              {mascotas.length === 0 ? (
                <p className="no-mascotas">
                  Este dueño no tiene mascotas registradas
                </p>
              ) : (
                <div className="mascotas-grid">
                  {mascotas.map((mascota) => (
                    <div key={mascota.id} className="mascota-card">
                      <h3>{mascota.nombre}</h3>
                      <div className="mascota-details">
                        <p>
                          <strong>Especie:</strong> {mascota.especie}
                        </p>
                        <p>
                          <strong>Raza:</strong>{" "}
                          {mascota.raza || "No especificada"}
                        </p>
                        <p>
                          <strong>Sexo:</strong> {mascota.sexo}
                        </p>
                        <p>
                          <strong>Peso:</strong>{" "}
                          {mascota.peso
                            ? `${mascota.peso} kg`
                            : "No especificado"}
                        </p>
                        <p>
                          <strong>Nacimiento:</strong>{" "}
                          {mascota.fecha_nacimiento
                            ? new Date(
                                mascota.fecha_nacimiento,
                              ).toLocaleDateString()
                            : "No especificada"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DuenosPage;
