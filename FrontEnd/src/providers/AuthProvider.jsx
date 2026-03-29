import React, { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { authService } from "../services/auth";

export const AuthProvider = ({ children }) => {
  // Inicializar con lazy initialization - se ejecuta UNA SOLA VEZ
  const [user, setUser] = useState(() => {
    return authService.getCurrentUser();
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.usuario);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === "ADMIN",
    isVeterinario: user?.rol === "VETERINARIO",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
