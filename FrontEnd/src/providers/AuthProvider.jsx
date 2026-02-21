import React, { useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.usuario);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'ADMIN',
    isVeterinario: user?.rol === 'VETERINARIO',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
