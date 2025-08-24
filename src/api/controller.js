const User = require("../models/userModel");
const Word = require("../models/wordModel");
const Sentence = require("../models/sentenceModel");
const { sendTokenResponse } = require("../middleware/auth");

// --- Autenticación ---
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validaciones
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos.",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario debe tener al menos 3 caracteres.",
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 4 caracteres.",
      });
    }

    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario ya existe.",
      });
    }

    const user = await User.create({ username, password });

    // Enviar token en respuesta
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos.",
      });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (user && (await user.comparePassword(password))) {
      // Enviar token en respuesta
      sendTokenResponse(user, 200, res);
    } else {
      res.status(401).json({
        success: false,
        message: "Credenciales inválidas.",
      });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor.",
    });
  }
};

exports.logout = (req, res) => {
  try {
    // Limpiar cookie del token
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Sesión cerrada con éxito.",
    });
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión.",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    // El middleware de protección ya habrá validado el token y agregado req.user
    if (req.user) {
      return res.status(200).json({
        success: true,
        data: {
          isAuthenticated: true,
          user: {
            id: req.user._id,
            username: req.user.username,
            score: req.user.score,
            progress: req.user.progress,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { isAuthenticated: false },
    });
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    res.status(500).json({
      success: false,
      message: "Error verificando autenticación.",
      data: { isAuthenticated: false },
    });
  }
};

// --- Lógica del Juego ---
exports.getGameContent = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "No autorizado.",
      });
    }

    const { mode, difficulty, chapter } = req.params;

    // Validaciones
    if (!mode || !difficulty || !chapter) {
      return res.status(400).json({
        success: false,
        message:
          "Parámetros faltantes: mode, difficulty, chapter son requeridos.",
      });
    }

    // Mapear dificultades del frontend al backend
    const difficultyMap = {
      easy: "facil",
      normal: "normal",
      difficult: "dificil",
    };

    const mappedDifficulty = difficultyMap[difficulty] || difficulty;
    const chapterNum = parseInt(chapter);

    if (isNaN(chapterNum) || chapterNum < 1 || chapterNum > 10) {
      return res.status(400).json({
        success: false,
        message: "Capítulo debe ser un número entre 1 y 10.",
      });
    }

    let content;
    if (mode === "words") {
      content = await Word.findOne({
        difficulty: mappedDifficulty,
        chapter: chapterNum,
      });
    } else if (mode === "sentences") {
      content = await Sentence.findOne({
        difficulty: mappedDifficulty,
        chapter: chapterNum,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Modo de juego no válido. Use 'words' o 'sentences'.",
      });
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Contenido no encontrado para este nivel.",
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Error en getGameContent:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor.",
    });
  }
};

exports.updateProgress = async (req, res) => {
  // El middleware protect ya validó la autenticación
  try {
    const { mode, difficulty, chapter, scoreToAdd } = req.body;

    // Validaciones
    if (!mode || !difficulty || !chapter || scoreToAdd === undefined) {
      return res.status(400).json({
        success: false,
        message: "Faltan parámetros requeridos.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    // Actualiza el puntaje
    user.score = (user.score || 0) + (scoreToAdd || 0);

    // Desbloquea el siguiente capítulo si es necesario
    const nextChapter = parseInt(chapter, 10) + 1;
    if (nextChapter <= 10) {
      // Asegurar que la estructura de progreso existe
      if (!user.progress) user.progress = {};
      if (!user.progress[mode]) user.progress[mode] = {};
      if (!user.progress[mode][difficulty]) {
        user.progress[mode][difficulty] = { unlocked: 1 };
      }

      const currentUnlocked = user.progress[mode][difficulty].unlocked || 1;
      if (nextChapter > currentUnlocked) {
        user.progress[mode][difficulty].unlocked = nextChapter;
      }
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "Progreso actualizado.",
      data: {
        score: user.score,
        progress: user.progress,
      },
    });
  } catch (error) {
    console.error("Error actualizando progreso:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor.",
      error: error.message,
    });
  }
};
