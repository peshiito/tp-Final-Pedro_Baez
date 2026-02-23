import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import VeterinarioDashboard from "./pages/Dashboards/VeterinarioDashboard";
import DuenosPage from "./pages/duenos/DuenosPage";
import NuevoDuenoPage from "./pages/NuevoDuenoPage";
import MascotasPage from "./pages/mascotas/MascotasPage";
import NuevaMascotaPage from "./pages/mascotas/NuevaMascotaPage";
import MascotaDetallePage from "./pages/mascotas/MascotaDetallePage";
import NuevoVeterinarioPage from "./pages/veterinarios/NuevoVeterinarioPage";
import NuevaConsultaPage from "./pages/veterinarios/NuevaConsultaPage";
import MisConsultasPage from "./pages/veterinarios/MisConsultasPage";
import MascotasAtendidasPage from "./pages/mascotas/MascotasAtendidasPage";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAdmin, isVeterinario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            {isAdmin ? (
              <AdminDashboard />
            ) : isVeterinario ? (
              <VeterinarioDashboard />
            ) : null}
          </ProtectedRoute>
        }
      />

      {/* Rutas de dueños - Solo admin */}
      <Route
        path="/duenos"
        element={
          <ProtectedRoute>
            {isAdmin ? <DuenosPage /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/duenos/nuevo"
        element={
          <ProtectedRoute>
            {isAdmin ? <NuevoDuenoPage /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        }
      />

      {/* Rutas de mascotas - Admin y veterinario */}
      <Route
        path="/mascotas"
        element={
          <ProtectedRoute>
            <MascotasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mascotas/nueva"
        element={
          <ProtectedRoute>
            <NuevaMascotaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mascotas/:id"
        element={
          <ProtectedRoute>
            <MascotaDetallePage />
          </ProtectedRoute>
        }
      />

      {/* Rutas de veterinarios - Solo admin */}
      <Route
        path="/veterinarios/nuevo"
        element={
          <ProtectedRoute>
            {isAdmin ? <NuevoVeterinarioPage /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        }
      />

      {/* Rutas de veterinario - Solo veterinario */}
      <Route
        path="/consulta/nueva"
        element={
          <ProtectedRoute>
            {isVeterinario ? (
              <NuevaConsultaPage />
            ) : (
              <Navigate to="/" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-consultas"
        element={
          <ProtectedRoute>
            {isVeterinario ? <MisConsultasPage /> : <Navigate to="/" replace />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/mascotas-atendidas"
        element={
          <ProtectedRoute>
            {isVeterinario ? (
              <MascotasAtendidasPage />
            ) : (
              <Navigate to="/" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
