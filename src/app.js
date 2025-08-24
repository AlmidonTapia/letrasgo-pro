// Importaciones de módulos
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Importación de rutas de la API
const apiRoutes = require("./api/routes");

// --- Conexión a la Base de Datos ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conexion a MongoDB exitosa"))
  .catch((err) => console.error("Error en la conexion con MongoDB:", err));

// Inicialización de la aplicación Express
const app = express();

// --- Middlewares ---
// Para parsear JSON en las peticiones
app.use(express.json());
// Para parsear datos de formularios
app.use(express.urlencoded({ extended: true }));
// Para parsear cookies
app.use(cookieParser());

// --- Rutas ---
// Sirve los archivos estáticos del frontend (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// Rutas de la API
app.use("/api", apiRoutes);

// Sirve la página de entrada principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Sirve la página de landing (autenticación)
app.get("/landing", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

// Sirve la página del juego
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/game.html"));
});

// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
