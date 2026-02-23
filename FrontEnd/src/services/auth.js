import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.usuario));
        console.log("Usuario guardado en localStorage:", response.data.usuario);
      }

      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error.response?.data || { message: "Error de conexión" };
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    console.log("Usuario recuperado de localStorage:", user);
    return user;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
