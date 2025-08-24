const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { protect } = require("../middleware/auth");

// Rutas de Autenticación (públicas)
router.post("/auth/register", controller.register);
router.post("/auth/login", controller.login);
router.post("/auth/logout", controller.logout);
router.get("/auth/check", protect, controller.checkAuth);

// Rutas de Juego (protegidas)
router.get(
  "/game/content/:mode/:difficulty/:chapter",
  protect,
  controller.getGameContent
);
router.put("/game/progress", protect, controller.updateProgress);

module.exports = router;
