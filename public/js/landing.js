document.addEventListener("DOMContentLoaded", () => {
  // Instancia del servicio API
  const api = new ApiService();

  // Elementos del DOM
  const dom = {
    screens: document.querySelectorAll(".screen"),

    // Botones de navegación
    startBtn: document.getElementById("start-btn"),
    goToLoginBtn: document.getElementById("go-to-login-btn"),
    goToRegisterBtn: document.getElementById("go-to-register-btn"),
    backBtns: document.querySelectorAll(".btn-back"),

    // Formularios
    loginForm: document.getElementById("login-form"),
    registerForm: document.getElementById("register-form"),

    // Campos de entrada
    loginUsername: document.getElementById("login-username"),
    loginPassword: document.getElementById("login-password"),
    registerUsername: document.getElementById("register-username"),
    registerPassword: document.getElementById("register-password"),
    registerConfirmPassword: document.getElementById(
      "register-confirm-password"
    ),
  };

  // Función para mostrar pantalla
  function showScreen(screenId) {
    const currentScreen = document.querySelector(".screen.active");
    const nextScreen = document.getElementById(screenId);

    if (currentScreen && nextScreen && currentScreen !== nextScreen) {
      currentScreen.classList.remove("active");
      nextScreen.classList.add("active");
    }
  }

  // Función para mostrar mensajes
  function showMessage(message, type = "info") {
    // Crear elemento de mensaje si no existe
    let messageOverlay = document.getElementById("message-overlay");
    let messageEl = document.getElementById("message");

    if (!messageOverlay) {
      messageOverlay = document.createElement("div");
      messageOverlay.id = "message-overlay";
      messageOverlay.className = "message-overlay";
      document.body.appendChild(messageOverlay);
    }

    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.id = "message";
      messageEl.className = "message";
      messageOverlay.appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    messageOverlay.style.display = "flex";

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      messageOverlay.style.display = "none";
    }, 3000);
  }

  // Función para validar campos
  function validateForm(username, password, confirmPassword = null) {
    if (!username || username.length < 3) {
      showMessage(
        "El nombre de usuario debe tener al menos 3 caracteres",
        "error"
      );
      return false;
    }

    if (!password || password.length < 4) {
      showMessage("La contraseña debe tener al menos 4 caracteres", "error");
      return false;
    }

    if (confirmPassword !== null && password !== confirmPassword) {
      showMessage("Las contraseñas no coinciden", "error");
      return false;
    }

    return true;
  }

  // Manejador de login
  async function handleLogin(e) {
    e.preventDefault();

    const username = dom.loginUsername.value.trim();
    const password = dom.loginPassword.value.trim();

    if (!validateForm(username, password)) return;

    try {
      showMessage("Iniciando sesión...", "info");
      const result = await api.login(username, password);

      if (result.success) {
        showMessage("¡Bienvenido!", "success");
        setTimeout(() => {
          window.location.href = "/game";
        }, 1000);
      } else {
        showMessage(
          result.data?.message || result.message || "Error al iniciar sesión",
          "error"
        );
      }
    } catch (error) {
      console.error("Error en login:", error);
      showMessage("Error de conexión", "error");
    }
  }

  // Manejador de registro
  async function handleRegister(e) {
    e.preventDefault();

    const username = dom.registerUsername.value.trim();
    const password = dom.registerPassword.value.trim();
    const confirmPassword = dom.registerConfirmPassword.value.trim();

    if (!validateForm(username, password, confirmPassword)) return;

    try {
      showMessage("Creando cuenta...", "info");
      const result = await api.register(username, password);

      if (result.success) {
        showMessage("¡Registro exitoso! Bienvenido al juego", "success");
        setTimeout(() => {
          window.location.href = "/game";
        }, 1000);
      } else {
        showMessage(
          result.data?.message || result.message || "Error al registrarse",
          "error"
        );
      }
    } catch (error) {
      console.error("Error en registro:", error);
      showMessage("Error de conexión", "error");
    }
  }

  // Event listeners
  dom.startBtn.addEventListener("click", () => {
    showScreen("auth-choice-screen");
  });

  dom.goToLoginBtn.addEventListener("click", () => {
    showScreen("login-screen");
  });

  dom.goToRegisterBtn.addEventListener("click", () => {
    showScreen("register-screen");
  });

  // Botones de regresar
  dom.backBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetScreen = e.target.dataset.target;
      showScreen(targetScreen);
    });
  });

  // Formularios
  dom.loginForm.addEventListener("submit", handleLogin);
  dom.registerForm.addEventListener("submit", handleRegister);

  // Verificar si el usuario ya está autenticado
  async function checkExistingAuth() {
    try {
      const result = await api.checkAuth();
      if (result.success && result.data.isAuthenticated) {
        window.location.href = "/game";
      }
    } catch (error) {
      console.log("No hay sesión activa");
    }
  }

  // Inicializar
  checkExistingAuth();
});
