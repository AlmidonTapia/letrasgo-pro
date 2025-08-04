class ApiService {
  constructor() {
    this.baseURL = "/api";
  }

  // Método genérico para hacer peticiones HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      return {
        success: response.ok,
        data: data,
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
