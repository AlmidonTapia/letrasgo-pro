document.addEventListener("DOMContentLoaded", async () => {
  // --- Verificación de Autenticación ---
  const api = new ApiService();

  try {
    const authResult = await api.checkAuth();
    if (!authResult.success || !authResult.data.isAuthenticated) {
      console.warn("Usuario no autenticado, redirigiendo al landing");
      window.location.href = "/landing";
      return;
    }
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    window.location.href = "/landing";
    return;
  }

  // --- Instancias de Módulos ---
  const audio = new AudioManager();
  const animation = new AnimationManager();
  let dragAndDrop;

  // --- Estado del Juego ---
  const state = {
    user: null,
    mode: null,
    difficulty: null,
    chapter: null,
    currentLevelData: null,
  };

  // --- Elementos del DOM ---
  const dom = {
    screens: document.querySelectorAll(".screen"),
    playerName: document.getElementById("player-name"),
    playerScore: document.getElementById("player-score"),
    progressDisplay: document.getElementById("progress-display"),
    logoutBtn: document.getElementById("logout-btn"),
    chapterGrid: document.getElementById("chapter-grid"),
    chapterLevelTitle: document.getElementById("chapter-level-title"),
    dropTarget: document.getElementById("drop-target"),
    piecesContainer: document.getElementById("pieces-container"),
    questionImage: document.getElementById("question-image"),
    soundToggle: document.getElementById("sound-toggle"),
    refreshGame: document.getElementById("refresh-game"),
    helpBtn: document.getElementById("help-btn"),
  };

  // --- Lógica de Navegación ---
  function showScreen(screenId) {
    const currentScreen = document.querySelector(".screen.active");
    const nextScreen = document.getElementById(screenId);
    if (currentScreen && nextScreen && currentScreen !== nextScreen) {
      currentScreen.classList.remove("active");
      nextScreen.classList.add("active");
      // Aquí se podría usar animation.transitionScreen(currentScreen, nextScreen);
      // pero para simplicidad, se usa un cambio de clase directo.
    }
  }

  function updateHeader() {
    if (!state.user) return;

    const playerNames = document.querySelectorAll('[id^="player-name"]');
    const playerScores = document.querySelectorAll('[id^="player-score"]');
    const progressDisplays = document.querySelectorAll(
      '[id^="progress-display"], .progress-counter'
    );

    playerNames.forEach((el) => {
      if (el) el.textContent = state.user.username || "Jugador";
    });

    playerScores.forEach((el) => {
      if (el) el.textContent = `SCORE: ${state.user.score || 0}`;
    });

    // Actualizar progreso si está en un nivel
    if (state.mode && state.difficulty && state.chapter) {
      const completed =
        state.user.progress?.[state.mode]?.[state.difficulty]?.unlocked - 1 ||
        0;
      progressDisplays.forEach((el) => {
        if (el) el.textContent = `${completed}/10`;
      });
    }
  }

  // --- Flujo del Juego ---
  function buildChapterGrid() {
    if (!dom.chapterGrid || !state.user || !state.mode || !state.difficulty) {
      console.error(
        "Faltan elementos necesarios para construir la grilla de capítulos"
      );
      return;
    }

    dom.chapterGrid.innerHTML = "";

    // Mapear la dificultad para mostrar en español
    const difficultyMap = {
      easy: "Fácil",
      normal: "Normal",
      difficult: "Difícil",
    };

    if (dom.chapterLevelTitle) {
      dom.chapterLevelTitle.textContent = `Nivel ${
        difficultyMap[state.difficulty] || state.difficulty
      }`;
    }

    const unlocked =
      state.user.progress?.[state.mode]?.[state.difficulty]?.unlocked || 1;

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.classList.add("chapter-number");
      btn.dataset.chapter = i;

      if (i > unlocked) {
        btn.classList.add("locked");
        btn.disabled = true;
        btn.title = "Completa los niveles anteriores para desbloquear";
      } else {
        btn.addEventListener("click", () => {
          audio.playSound("click");
          animation.animateButtonClick(btn);
          state.chapter = i;
          startLevel();
        });

        if (i === unlocked) {
          btn.classList.add("current");
        }
      }
      dom.chapterGrid.appendChild(btn);
    }
    animation.animateChapterGrid(dom.chapterGrid);
  }

  async function startLevel() {
    console.log(
      "Iniciando nivel:",
      state.mode,
      state.difficulty,
      state.chapter
    );
    showScreen("game-play-screen");

    // Resetear la zona de construcción
    dom.dropTarget.innerHTML =
      '<span class="placeholder-text">ARRASTRE AQUÍ</span>';
    dom.piecesContainer.innerHTML = "";

    try {
      // Obtener contenido del juego desde la API
      const result = await api.getGameContent(
        state.mode,
        state.difficulty,
        state.chapter
      );

      if (!result.success) {
        console.error("Error al obtener contenido:", result.message);
        alert(
          "Error al cargar el nivel: " +
            (result.data?.message || result.message || "Error desconocido")
        );
        return;
      }

      state.currentLevelData = result.data;
      console.log("Datos del nivel:", state.currentLevelData);

      // Verificar que los datos son válidos
      if (!state.currentLevelData) {
        console.error("Datos del nivel vacíos");
        alert("Error: No se pudo cargar el contenido del nivel");
        return;
      }
    } catch (error) {
      console.error("Error obteniendo contenido del juego:", error);
      alert("Error de conexión al cargar el nivel");
      return;
    }

    // Actualizar la imagen del ejercicio
    const questionImg = document.getElementById("question-image");
    if (questionImg && state.currentLevelData.image) {
      questionImg.src = state.currentLevelData.image;
      questionImg.alt =
        state.currentLevelData.word ||
        state.currentLevelData.sentence ||
        "Ejercicio";
    }

    // Actualizar el progreso
    if (dom.progressDisplay) {
      dom.progressDisplay.textContent = `${state.chapter}/10`;
    }

    // Obtener las piezas (sílabas o palabras)
    const pieces =
      state.currentLevelData.syllables || state.currentLevelData.words;

    if (!pieces || pieces.length === 0) {
      console.error("No se encontraron piezas para el nivel");
      alert("Error: No hay contenido disponible para este nivel");
      return;
    }

    // Desordena las piezas para que no aparezcan en orden
    const shuffledPieces = [...pieces].sort(() => Math.random() - 0.5);

    // Crear elementos de las piezas
    shuffledPieces.forEach((piece) => {
      const pieceEl = document.createElement("div");
      pieceEl.classList.add("draggable-piece", "bubble-piece");
      pieceEl.textContent = piece;
      pieceEl.draggable = true;
      dom.piecesContainer.appendChild(pieceEl);
    });

    console.log("Piezas creadas:", shuffledPieces);

    // Animar entrada de piezas
    if (animation && animation.animateGamePiecesIn) {
      animation.animateGamePiecesIn(dom.piecesContainer.children);
    }

    // Destruir instancia anterior de drag & drop
    if (dragAndDrop) {
      dragAndDrop.destroy();
    }

    // Crear nueva instancia de drag & drop
    dragAndDrop = new DragAndDrop({
      onDragStart: () => {
        if (audio) audio.playSound("drag");
      },
      onDrop: (piece) => {
        if (audio) audio.playSound("drop");
      },
      onCorrect: handleCorrectAnswer,
      onIncorrect: handleIncorrectAnswer,
    });

    // Configurar drag & drop
    const solution =
      state.currentLevelData.solution || state.currentLevelData.word;
    if (!solution) {
      console.error("No se encontró solución para el nivel");
      alert("Error: No hay solución definida para este nivel");
      return;
    }

    dragAndDrop.create(".draggable-piece", "#drop-target", solution);
    console.log("Drag & drop configurado para solución:", solution);
  }

  async function handleCorrectAnswer() {
    audio.playSound("win");
    animation.showFeedback("¡FELICIDADES!", "#6abf4b");

    const scoreToAdd = 10;
    state.user.score = (state.user.score || 0) + scoreToAdd;

    try {
      const result = await api.updateProgress({
        mode: state.mode,
        difficulty: state.difficulty,
        chapter: state.chapter,
        scoreToAdd,
      });

      if (result.success && result.data) {
        state.user.progress = result.data.progress;
        state.user.score = result.data.score || state.user.score;
      } else {
        console.warn("Error actualizando progreso:", result.message);
      }
    } catch (error) {
      console.error("Error al actualizar progreso:", error);
    }

    setTimeout(() => {
      animation.hideFeedback();
      updateHeader();
      showScreen("chapter-select-screen");
      buildChapterGrid();
    }, 2000);
  }

  function handleIncorrectAnswer() {
    audio.playSound("error");
    animation.shakeElement(dom.dropTarget);
    animation.showFeedback("¡Intenta otra vez!", "#d32f2f");

    setTimeout(() => {
      animation.hideFeedback();

      // Resetear el drag and drop
      if (dragAndDrop) {
        dragAndDrop.reset();
      }
    }, 2000);
  }

  // --- Event Listeners e Inicialización ---
  function bindEvents() {
    document.querySelectorAll(".btn-mode").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        state.mode = e.target.dataset.mode;
        showScreen("difficulty-select-screen");
      });
    });

    document.querySelectorAll(".difficulty-card").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        const target = e.target.closest(".difficulty-card");
        state.difficulty = target.dataset.difficulty;
        buildChapterGrid();
        showScreen("chapter-select-screen");
      });
    });

    document.querySelectorAll(".btn-back").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        showScreen(e.target.dataset.target);
      });
    });

    document.querySelectorAll(".btn-back-main").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        showScreen(e.target.dataset.target);
      });
    });

    document.querySelectorAll(".btn-back-game").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        showScreen(e.target.dataset.target);
      });
    });

    // Controles de sonido
    document.querySelectorAll(".sound-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        audio.toggleSound();
        const icon = btn.querySelector("i");
        if (icon) {
          icon.className = audio.isMuted
            ? "bi bi-volume-mute"
            : "bi bi-volume-up";
        }
      });
    });

    // Botón de ayuda
    document.querySelectorAll(".help-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        audio.playSound("click");
        showHelp();
      });
    });

    // Botón de reiniciar
    document.querySelectorAll(".refresh-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        audio.playSound("click");
        if (state.mode && state.difficulty && state.chapter) {
          startLevel();
        }
      });
    });

    // Botón volver en el juego
    document.querySelectorAll(".return-button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        audio.playSound("click");
        const target = e.target.closest(".return-button")?.dataset?.target;
        if (target) {
          showScreen(target);
        } else {
          showScreen("chapter-select-screen");
        }
      });
    });

    // Botón de cerrar sesión
    if (dom.logoutBtn) {
      dom.logoutBtn.addEventListener("click", async () => {
        try {
          await api.logout();
          window.location.href = "/landing";
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
          window.location.href = "/landing";
        }
      });
    }
  }

  function showHelp() {
    let helpText = "¡Bienvenido a LetrasGo Pro!\n\n";

    if (state.mode === "words") {
      helpText +=
        "🔤 Modo Palabras:\nArrastra las sílabas en el orden correcto para formar la palabra que ves en la imagen.";
    } else if (state.mode === "sentences") {
      helpText +=
        "📝 Modo Oraciones:\nArrastra las palabras en el orden correcto para formar la oración que describe la imagen.";
    } else {
      helpText +=
        "Selecciona un modo de juego para comenzar:\n\n🔤 Palabras: Forma palabras con sílabas\n📝 Oraciones: Construye oraciones completas";
    }

    alert(helpText);
  }

  async function init() {
    try {
      audio.preloadSounds();
      const authResult = await api.checkAuth();

      if (authResult.success && authResult.data.isAuthenticated) {
        state.user = authResult.data.user;

        // Asegurar que el usuario tiene estructura de progreso inicial
        if (!state.user.progress) {
          state.user.progress = {
            words: {
              easy: { unlocked: 1 },
              normal: { unlocked: 1 },
              difficult: { unlocked: 1 },
            },
            sentences: {
              easy: { unlocked: 1 },
              normal: { unlocked: 1 },
              difficult: { unlocked: 1 },
            },
          };
        }

        // Asegurar que tiene puntuación
        if (!state.user.score) {
          state.user.score = 0;
        }

        updateHeader();
        bindEvents();
        showScreen("mode-select-screen");
      } else {
        console.warn("Usuario no autenticado, redirigiendo...");
        window.location.href = "/landing";
      }
    } catch (error) {
      console.error("Error en inicialización:", error);
      window.location.href = "/landing";
    }
  }

  init();
});
