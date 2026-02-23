import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './NuevoDuenoPage.css';

const NuevoDuenoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [nuevoDueno, setNuevoDueno] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: '',
    dni: ''
  });

  // Generar contraseña aleatoria
  const generarPassword = () => {
    const length = 10;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setNuevoDueno(null);

    // Generar contraseña aleatoria
    const passwordGenerada = generarPassword();

    try {
      const token = localStorage.getItem('token');
      
      const response = await api.post('/auth/register/dueno', {
        ...formData,
        password: passwordGenerada
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNuevoDueno({
        ...formData,
        password: passwordGenerada,
        id: response.data.duenoId
      });
      
      setSuccess(true);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        direccion: '',
        telefono: '',
        dni: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear el dueño');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="nuevo-dueno-page">
        <div className="page-header">
          <h1>Registrar Nuevo Dueño</h1>
          <button className="btn-back" onClick={() => navigate('/duenos')}>
            ← Volver
          </button>
        </div>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          
          {success && nuevoDueno && (
            <div className="success-card">
              <h3>✅ Dueño creado exitosamente</h3>
              <div className="success-details">
                <p><strong>Nombre:</strong> {nuevoDueno.nombre} {nuevoDueno.apellido}</p>
                <p><strong>Email:</strong> {nuevoDueno.email}</p>
                <div className="password-box">
                  <p><strong>Contraseña generada:</strong></p>
                  <code className="password-display">{nuevoDueno.password}</code>
                  <p className="password-note">*Guarde esta contraseña si el dueño necesita acceder al sistema</p>
                </div>
              </div>
              <button 
                className="btn-continuar"
                onClick={() => setSuccess(false)}
              >
                Crear otro dueño
              </button>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="dueno-form">
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dni">DNI</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Número de documento"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Número de teléfono"
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
                  />
                </div>
              </div>

              <div className="form-info">
                <p>ℹ️ Se generará una contraseña aleatoria automáticamente</p>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/duenos')}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Dueño'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NuevoDuenoPage;
