import React from 'react';
import { AuthProvider } from './providers/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Login from './components/login/Login';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import VeterinarioDashboard from './components/veterinarioDashboard/VeterinarioDashboard';
import './App.css';

const AppContent = () => {
  const { isAuthenticated, isAdmin, isVeterinario } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isVeterinario) {
    return <VeterinarioDashboard />;
  }

  return <Login />;
};

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
