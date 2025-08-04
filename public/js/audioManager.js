class AudioManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.soundFiles = {
      correct: "audio/correct.mp3",
      error: "audio/error.mp3",
      drag: "audio/drag.mp3",
      drop: "audio/drop.mp3",
      win: "audio/win.mp3",
      click: "audio/click.mp3",
    };
  }

  preloadSounds() {
    console.log("Pre-cargando sonidos...");
    for (const key in this.soundFiles) {
      try {
        this.sounds[key] = new Audio(this.soundFiles[key]);
        this.sounds[key].volume = 0.5;

        // Agregar evento para manejar errores de carga
        this.sounds[key].addEventListener("error", () => {
          console.log(`No se pudo cargar el sonido: ${key}`);
          this.sounds[key] = null;
        });
      } catch (error) {
        console.log(`Error al crear audio para: ${key}`, error);
        this.sounds[key] = null;
      }
    }
  }

  playSound(name) {
    if (this.isMuted || !this.sounds[name]) return;

    try {
      this.sounds[name].currentTime = 0;
      this.sounds[name]
        .play()
        .catch((e) =>
          console.log(`No se pudo reproducir el sonido: ${name}`, e)
        );
    } catch (error) {
      console.log(`Error al reproducir sonido: ${name}`, error);
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    console.log(this.isMuted ? "Sonido desactivado" : "Sonido activado");
  }

  setVolume(volume) {
    const vol = Math.max(0, Math.min(1, volume));
    for (const key in this.sounds) {
      if (this.sounds[key]) {
        this.sounds[key].volume = vol;
      }
    }
  }
}
