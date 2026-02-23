import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./NuevaConsultaPage.css";

const NuevaConsultaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Estados para la búsqueda
  const [emailBusqueda, setEmailBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [duenoEncontrado, setDuenoEncontrado] = useState(null);
  const [mascotas, setMascotas] = useState([]);

  // Estados para la consulta
  const [consultaData, setConsultaData] = useState({
    mascota_id: "",
    fecha: new Date().toISOString().split("T")[0],
    tipo: "CONSULTA",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  });

  // Buscar dueño por email - VERSIÓN CORREGIDA
  const handleBuscarDueno = async (e) => {
    e.preventDefault();
    if (!emailBusqueda.trim()) return;

    setBuscando(true);
    setError("");
    setDuenoEncontrado(null);
    setMascotas([]);

    try {
      console.log("Buscando dueño con email:", emailBusqueda);

      // Usar el endpoint específico para búsqueda por email
      const duenoRes = await api.get(
        `/duenos/buscar-por-email/${encodeURIComponent(emailBusqueda)}`,
      );

      console.log("Dueño encontrado:", duenoRes.data);
      setDuenoEncontrado(duenoRes.data);

      // Buscar mascotas del dueño
      const mascotasRes = await api.get(`/mascotas/dueno/${duenoRes.data.id}`);
      console.log("Mascotas del dueño:", mascotasRes.data);

      setMascotas(mascotasRes.data.mascotas || []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      if (error.response?.status === 404) {
        setError("No se encontró un dueño con ese email");
      } else if (error.response?.status === 403) {
        setError("No tienes permisos para realizar esta búsqueda");
      } else {
        setError(
          "Error al buscar el dueño: " +
            (error.response?.data?.message || error.message),
        );
      }
    } finally {
      setBuscando(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setConsultaData({
      ...consultaData,
      [e.target.name]: e.target.value,
    });
  };

  // Obtener veterinario ID del usuario logueado
  const obtenerVeterinarioId = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const currentUser = userStr ? JSON.parse(userStr) : user;

      if (currentUser.perfilId) {
        return currentUser.perfilId;
      }

      // Si no hay perfilId, buscar por email
      const veterinarioRes = await api.get(
        `/veterinarios/email/${currentUser.email}`,
      );
      return veterinarioRes.data.id;
    } catch (error) {
      console.error("Error obteniendo veterinario ID:", error);
      return null;
    }
  };

  // Enviar consulta
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consultaData.mascota_id) {
      setError("Debe seleccionar una mascota");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const veterinarioId = await obtenerVeterinarioId();

      if (!veterinarioId) {
        setError("No se pudo identificar al veterinario");
        setSubmitting(false);
        return;
      }

      const consultaPayload = {
        ...consultaData,
        veterinario_id: veterinarioId,
        fecha: new Date(consultaData.fecha).toISOString().split("T")[0],
      };

      console.log("Enviando consulta:", consultaPayload);
      await api.post("/historial", consultaPayload);

      setSuccess(true);

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creando consulta:", error);
      setError(error.response?.data?.message || "Error al crear la consulta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="nueva-consulta-page">
        <div className="page-header">
          <h1>Iniciar Nueva Consulta</h1>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Volver al Dashboard
          </button>
        </div>

        {success && (
          <div className="success-message">
            ✅ ¡Consulta registrada exitosamente! Redirigiendo...
          </div>
        )}

        {error && <div className="error-message">❌ {error}</div>}

        {/* Paso 1: Buscar dueño */}
        {!duenoEncontrado && !success && (
          <div className="search-section">
            <h2>Paso 1: Buscar Dueño por Email</h2>
            <form onSubmit={handleBuscarDueno} className="search-form">
              <div className="search-input-group">
                <input
                  type="email"
                  className="search-input"
                  placeholder="Ingrese email del dueño..."
                  value={emailBusqueda}
                  onChange={(e) => setEmailBusqueda(e.target.value)}
                  disabled={buscando || submitting}
                />
                <button
                  type="submit"
                  className="search-button"
                  disabled={buscando || submitting}
                >
                  {buscando ? "Buscando..." : "Buscar Dueño"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mostrar información del dueño encontrado */}
        {duenoEncontrado && !success && (
          <div className="dueno-info-section">
            <h2>
              Dueño: {duenoEncontrado.nombre} {duenoEncontrado.apellido}
            </h2>
            <p>
              <strong>Email:</strong> {duenoEncontrado.email}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {duenoEncontrado.telefono || "No especificado"}
            </p>
            <p>
              <strong>DNI:</strong> {duenoEncontrado.dni || "No especificado"}
            </p>
          </div>
        )}

        {/* Paso 2: Seleccionar mascota y llenar consulta */}
        {duenoEncontrado && mascotas.length > 0 && !success && (
          <form onSubmit={handleSubmit} className="consulta-form">
            <h2>Paso 2: Seleccionar Mascota</h2>

            <div className="form-group">
              <label>Seleccionar Mascota *</label>
              <select
                name="mascota_id"
                value={consultaData.mascota_id}
                onChange={handleChange}
                required
                disabled={submitting}
              >
                <option value="">-- Seleccione una mascota --</option>
                {mascotas.map((mascota) => (
                  <option key={mascota.id} value={mascota.id}>
                    {mascota.nombre} ({mascota.especie} -{" "}
                    {mascota.raza || "Sin raza"})
                  </option>
                ))}
              </select>
            </div>

            <h2>Paso 3: Datos de la Consulta</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de la Consulta *</label>
                <input
                  type="date"
                  name="fecha"
                  value={consultaData.fecha}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Tipo de Consulta *</label>
                <select
                  name="tipo"
                  value={consultaData.tipo}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="CONSULTA">Consulta General</option>
                  <option value="VACUNA">Vacunación</option>
                  <option value="CIRUGIA">Cirugía</option>
                  <option value="CONTROL">Control</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Diagnóstico *</label>
              <textarea
                name="diagnostico"
                rows="3"
                value={consultaData.diagnostico}
                onChange={handleChange}
                required
                disabled={submitting}
                placeholder="Ingrese el diagnóstico de la consulta"
              />
            </div>

            <div className="form-group">
              <label>Tratamiento</label>
              <textarea
                name="tratamiento"
                rows="3"
                value={consultaData.tratamiento}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Ingrese el tratamiento recetado (opcional)"
              />
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                name="observaciones"
                rows="2"
                value={consultaData.observaciones}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Observaciones adicionales (opcional)"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || !consultaData.mascota_id}
              >
                {submitting ? "Guardando..." : "Registrar Consulta"}
              </button>
            </div>
          </form>
        )}

        {/* Si el dueño no tiene mascotas */}
        {duenoEncontrado && mascotas.length === 0 && !success && (
          <div className="no-mascotas">
            <p>Este dueño no tiene mascotas registradas.</p>
            <button
              className="btn-primary"
              onClick={() => {
                setDuenoEncontrado(null);
                setEmailBusqueda("");
              }}
            >
              Buscar otro dueño
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NuevaConsultaPage;
