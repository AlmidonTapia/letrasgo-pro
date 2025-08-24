const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  // Verificar si el token existe en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(" ")[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      next();
    } catch (error) {
      console.error("Error en verificación de token:", error);
      return res.status(401).json({
        success: false,
        message: "Token no válido",
      });
    }
  }

  // También verificar en cookies para compatibilidad con frontend
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      next();
    } catch (error) {
      console.error("Error en verificación de token desde cookie:", error);
      return res.status(401).json({
        success: false,
        message: "Token no válido",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado, no hay token",
    });
  }
};

// Enviar token en cookie y respuesta
const sendTokenResponse = (user, statusCode, res) => {
  // Crear token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict",
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message:
        statusCode === 201
          ? "Usuario registrado exitosamente"
          : "Login exitoso",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          score: user.score,
          progress: user.progress,
        },
      },
    });
};

module.exports = {
  generateToken,
  protect,
  sendTokenResponse,
};
