// Importaciones de módulos
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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

// Configuración de la Sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,
      secure: false, // Poner en 'true' en producción (HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 1 día de duración
    },
  })
);

// --- Rutas ---
// Sirve los archivos estáticos del frontend (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// Rutas de la API
app.use("/api", apiRoutes);

// Sirve la página de entrada principal (con validación de sesión)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Sirve la página de landing (autenticación)
app.get("/landing", (req, res) => {
  // Si ya está autenticado, redirigir al juego
  if (req.session.userId) {
    return res.redirect("/game");
  }
  res.sendFile(path.join(__dirname, "../public/landing.html"));
});

// Sirve la página del juego (requiere autenticación)
app.get("/game", (req, res) => {
  // Middleware de protección: si no hay sesión, redirige al landing
  if (!req.session.userId) {
    return res.redirect("/landing");
  }
  res.sendFile(path.join(__dirname, "../public/game.html"));
});

// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
