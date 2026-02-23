import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './NuevaMascotaPage.css';

const NuevaMascotaPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duenos, setDuenos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false); // Prevenir doble envío

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    sexo: 'MACHO',
    fecha_nacimiento: '',
    peso: '',
    dueno_id: ''
  });

  // Cargar lista de dueños
  useEffect(() => {
    const fetchDuenos = async () => {
      try {
        const response = await api.get('/duenos');
        setDuenos(response.data || []);
      } catch (error) {
        console.error('Error cargando dueños:', error);
      }
    };

    fetchDuenos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filtrar dueños por búsqueda
  const duenosFiltrados = duenos.filter(dueno => 
    `${dueno.nombre} ${dueno.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dueno.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dueno.dni?.includes(searchTerm)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevenir doble envío
    if (formSubmitted || loading) return;
    
    setFormSubmitted(true);
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      const mascotaData = {
        ...formData,
        peso: formData.peso ? parseFloat(formData.peso) : null
      };

      const response = await api.post('/mascotas', mascotaData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Obtener el nombre del dueño seleccionado para mostrar en el mensaje
      const duenoSeleccionado = duenos.find(d => d.id === parseInt(formData.dueno_id));
      
      setSuccessData({
        nombre: formData.nombre,
        especie: formData.especie,
        dueno: duenoSeleccionado ? `${duenoSeleccionado.nombre} ${duenoSeleccionado.apellido}` : 'Desconocido'
      });
      
      setSuccess(true);
      
      // Opción 1: Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/mascotas');
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la mascota');
      setFormSubmitted(false); // Permitir reintentar en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Resetear el formulario para crear otra mascota
  const handleCrearOtra = () => {
    setSuccess(false);
    setSuccessData(null);
    setFormSubmitted(false);
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      sexo: 'MACHO',
      fecha_nacimiento: '',
      peso: '',
      dueno_id: ''
    });
    setSearchTerm('');
  };

  return (
    <MainLayout>
      <div className="nueva-mascota-page">
        <div className="page-header">
          <h1>Registrar Nueva Mascota</h1>
          <button className="btn-back" onClick={() => navigate('/mascotas')}>
            ← Volver
          </button>
        </div>

        <div className="form-container">
          {error && (
            <div className="error-message visible">
              <strong>❌ Error:</strong> {error}
            </div>
          )}
          
          {success && successData && (
            <div className="success-message-visible">
              <div className="success-icon">✅</div>
              <div className="success-content">
                <h3>¡Mascota creada exitosamente!</h3>
                <div className="success-details">
                  <p><strong>Nombre:</strong> {successData.nombre}</p>
                  <p><strong>Especie:</strong> {successData.especie}</p>
                  <p><strong>Dueño:</strong> {successData.dueno}</p>
                </div>
                <div className="success-actions">
                  <button className="btn-secondary" onClick={handleCrearOtra}>
                    + Crear otra mascota
                  </button>
                  <button className="btn-primary" onClick={() => navigate('/mascotas')}>
                    Ver listado
                  </button>
                </div>
                <p className="redirect-message">Redirigiendo al listado en 3 segundos...</p>
              </div>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="mascota-form">
              {/* Datos de la mascota */}
              <h2 className="form-section-title">Datos de la Mascota</h2>
              
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
                    placeholder="Nombre de la mascota"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="especie">Especie *</label>
                  <select
                    id="especie"
                    name="especie"
                    value={formData.especie}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccione una especie</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Roedor">Roedor</option>
                    <option value="Reptil">Reptil</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="raza">Raza</label>
                  <input
                    type="text"
                    id="raza"
                    name="raza"
                    value={formData.raza}
                    onChange={handleChange}
                    placeholder="Raza de la mascota"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sexo">Sexo *</label>
                  <select
                    id="sexo"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="MACHO">Macho</option>
                    <option value="HEMBRA">Hembra</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    id="fecha_nacimiento"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="peso">Peso (kg)</label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={formData.peso}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Selección de dueño */}
              <h2 className="form-section-title">Seleccionar Dueño</h2>
              
              <div className="dueno-search">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar dueño por nombre, email o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="duenos-list">
                {duenosFiltrados.length === 0 ? (
                  <p className="no-duenos">No se encontraron dueños</p>
                ) : (
                  duenosFiltrados.map(dueno => (
                    <div
                      key={dueno.id}
                      className={`dueno-option ${formData.dueno_id === dueno.id ? 'selected' : ''}`}
                      onClick={() => !loading && setFormData({...formData, dueno_id: dueno.id})}
                    >
                      <div className="dueno-option-info">
                        <strong>{dueno.nombre} {dueno.apellido}</strong>
                        <span>{dueno.email}</span>
                        {dueno.dni && <span>DNI: {dueno.dni}</span>}
                      </div>
                      {formData.dueno_id === dueno.id && (
                        <span className="selected-check">✓</span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {formData.dueno_id === '' && (
                <p className="warning-message">⚠️ Debe seleccionar un dueño para la mascota</p>
              )}

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/mascotas')} disabled={loading}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={loading || !formData.dueno_id || formSubmitted}
                >
                  {loading ? 'Creando...' : 'Crear Mascota'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NuevaMascotaPage;
