class ApiService {
  constructor() {
    this.baseURL = "/api";
    this.token = this.getTokenFromCookie();
  }

  // Obtener token desde cookie
  getTokenFromCookie() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token") {
        return value;
      }
    }
    return null;
  }

  // Método genérico para hacer peticiones HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Preparar headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Agregar token de autorización si existe
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      headers,
      credentials: "include", // Para incluir cookies
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Actualizar token si viene en la respuesta
      if (data.data?.token) {
        this.token = data.data.token;
      }

      return {
        success: response.ok,
        data: data.data || data,
        status: response.status,
        message: data.message || (response.ok ? "Success" : "Error"),
      };
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        data: null,
        status: 500,
        message: "Network error",
      };
    }
  }

  // Métodos de autenticación
  async register(username, password) {
    return this.request("/auth/register", {
      method: "POST",
      body: { username, password },
    });
  }

  async login(username, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: { username, password },
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async checkAuth() {
    return this.request("/auth/check");
  }

  // Métodos del juego
  async getGameContent(mode, difficulty, chapter) {
    return this.request(`/game/content/${mode}/${difficulty}/${chapter}`);
  }

  async updateProgress(progressData) {
    return this.request("/game/progress", {
      method: "PUT",
      body: progressData,
    });
  }

  // Método para obtener estadísticas del usuario
  async getUserStats() {
    return this.request("/user/stats");
  }

  // Método para obtener el ranking
  async getLeaderboard() {
    return this.request("/game/leaderboard");
  }
}
