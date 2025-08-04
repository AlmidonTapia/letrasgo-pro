document.addEventListener("DOMContentLoaded", async () => {
  const api = new ApiService();

  // Mostrar pantalla de carga por al menos 2 segundos
  const startTime = Date.now();
  const minLoadTime = 2000;

  try {
    // Verificar si el usuario ya está autenticado
    const result = await api.checkAuth();

    // Calcular tiempo restante de carga
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - elapsedTime);

    setTimeout(() => {
      if (result.success && result.data.isAuthenticated) {
        // Usuario autenticado, ir al juego
        window.location.href = "/game";
      } else {
        // Usuario no autenticado, ir al landing
        window.location.href = "/landing";
      }
    }, remainingTime);
  } catch (error) {
    console.log("Error verificando autenticación:", error);

    // En caso de error, esperar tiempo mínimo y ir al landing
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minLoadTime - elapsedTime);

    setTimeout(() => {
      window.location.href = "/landing";
    }, remainingTime);
  }
});
