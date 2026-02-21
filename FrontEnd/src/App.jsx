import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import VeterinarioDashboard from './pages/VeterinarioDashboard';
import DuenosPage from './pages/DuenosPage';
import MascotasPage from './pages/MascotasPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAdmin, isVeterinario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          {isAdmin ? <AdminDashboard /> : isVeterinario ? <VeterinarioDashboard /> : null}
        </ProtectedRoute>
      } />
      
      <Route path="/duenos" element={
        <ProtectedRoute>
          {isAdmin ? <DuenosPage /> : <Navigate to="/" replace />}
        </ProtectedRoute>
      } />
      
      <Route path="/mascotas" element={
        <ProtectedRoute>
          <MascotasPage />
        </ProtectedRoute>
      } />
      
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
