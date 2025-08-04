const express = require("express");
const router = express.Router();
const controller = require("./controller");

// Rutas de Autenticación
router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);
router.post("/auth/logout", controller.logout);
router.get("/auth/check", controller.checkAuth);

// Rutas de Juego
router.get(
  "/game/content/:mode/:difficulty/:chapter",
  controller.getGameContent
);
router.put("/game/progress", controller.updateProgress);

module.exports = router;
