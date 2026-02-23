import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./NuevoVeterinarioPage.css";

const NuevoVeterinarioPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [nuevoVeterinario, setNuevoVeterinario] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    matricula: "",
    especialidad: "",
    direccion: "",
    adminPassword: "", // Contraseña del admin para verificar
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Limpiar errores al escribir
    if (e.target.name === "adminPassword") {
      setVerificationError("");
    }
  };

  const validateForm = () => {
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }

    // Validar que la contraseña de admin no esté vacía
    if (!formData.adminPassword) {
      setVerificationError("Debe ingresar su contraseña de administrador");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formSubmitted || loading) return;

    // Validar formulario
    if (!validateForm()) return;

    setFormSubmitted(true);
    setLoading(true);
    setError("");
    setVerificationError("");
    setSuccess(false);
    setNuevoVeterinario(null);

    try {
      const token = localStorage.getItem("token");

      // Primero verificamos la contraseña del admin
      // Esto lo hacemos intentando hacer login con el admin
      const adminEmail = JSON.parse(localStorage.getItem("user")).email;

      const verifyResponse = await api.post("/auth/login", {
        email: adminEmail,
        password: formData.adminPassword,
      });

      if (!verifyResponse.data.token) {
        setVerificationError("Contraseña de administrador incorrecta");
        setFormSubmitted(false);
        setLoading(false);
        return;
      }

      // Si la verificación es exitosa, procedemos a crear el veterinario
      const response = await api.post(
        "/auth/register/veterinario",
        {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          matricula: formData.matricula,
          especialidad: formData.especialidad,
          direccion: formData.direccion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNuevoVeterinario({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        matricula: formData.matricula,
        especialidad: formData.especialidad,
        id: response.data.veterinarioId,
        usuarioId: response.data.usuarioId,
      });

      setSuccess(true);
    } catch (error) {
      if (error.response?.status === 401) {
        setVerificationError("Contraseña de administrador incorrecta");
      } else {
        setError(
          error.response?.data?.message || "Error al crear el veterinario",
        );
      }
      setFormSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearOtro = () => {
    setSuccess(false);
    setNuevoVeterinario(null);
    setFormSubmitted(false);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmPassword: "",
      matricula: "",
      especialidad: "",
      direccion: "",
      adminPassword: "",
    });
  };

  return (
    <MainLayout>
      <div className="nuevo-veterinario-page">
        <div className="page-header">
          <h1>Registrar Nuevo Veterinario</h1>
          <button className="btn-back" onClick={() => navigate("/")}>
            ← Volver al Dashboard
          </button>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message visible">
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {verificationError && (
            <div className="error-message visible verification-error">
              <strong>🔐 Error de verificación:</strong> {verificationError}
            </div>
          )}

          {success && nuevoVeterinario && (
            <div className="success-message-visible vet-success">
              <div className="success-icon">👨‍⚕️</div>
              <div className="success-content">
                <h3>¡Veterinario registrado exitosamente!</h3>
                <div className="success-details">
                  <p>
                    <strong>Nombre:</strong> {nuevoVeterinario.nombre}{" "}
                    {nuevoVeterinario.apellido}
                  </p>
                  <p>
                    <strong>Email:</strong> {nuevoVeterinario.email}
                  </p>
                  <p>
                    <strong>Matrícula:</strong> {nuevoVeterinario.matricula}
                  </p>
                  <p>
                    <strong>Especialidad:</strong>{" "}
                    {nuevoVeterinario.especialidad || "No especificada"}
                  </p>
                </div>

                <div className="success-actions">
                  <button className="btn-secondary" onClick={handleCrearOtro}>
                    + Registrar otro veterinario
                  </button>
                  <button className="btn-primary" onClick={() => navigate("/")}>
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="veterinario-form">
              <h2 className="form-section-title">Datos del Veterinario</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el nombre"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido *</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el apellido"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="matricula">Matrícula Profesional *</label>
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    required
                    placeholder="N° de matrícula"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="especialidad">Especialidad</label>
                  <input
                    type="text"
                    id="especialidad"
                    name="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    placeholder="Ej: Cirugía, Dermatología, etc."
                    disabled={loading}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Dirección completa"
                    disabled={loading}
                  />
                </div>
              </div>

              <h2 className="form-section-title">
                Credenciales del Veterinario
              </h2>

              <div className="form-grid password-grid">
                <div className="form-group">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    minLength="6"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    minLength="6"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="admin-verification-section">
                <h2 className="form-section-title verification-title">
                  🔐 Verificación de Administrador
                </h2>
                <div className="verification-box">
                  <p className="verification-text">
                    Por seguridad, ingrese su contraseña de administrador para
                    confirmar esta acción:
                  </p>
                  <div className="form-group">
                    <label htmlFor="adminPassword">
                      Tu Contraseña de Admin *
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      required
                      placeholder="Ingresa tu contraseña"
                      disabled={loading}
                      className={verificationError ? "input-error" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="form-info">
                <p>
                  ℹ️ El veterinario podrá cambiar su contraseña después de
                  iniciar sesión
                </p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => navigate("/")}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading || formSubmitted}
                >
                  {loading ? "Verificando..." : "Registrar Veterinario"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NuevoVeterinarioPage;
