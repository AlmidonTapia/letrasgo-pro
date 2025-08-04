const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    enum: ["facil", "normal", "dificil"],
    required: true,
  },
  chapter: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  solution: {
    // La palabra correcta, ej: "CAMPANA"
    type: String,
    required: true,
    uppercase: true,
  },
  syllables: {
    // Las sílabas para mostrar, ej: ["CAM", "PA", "NA"]
    type: [String],
    required: true,
  },
  image: {
    // Opcional: ruta a una imagen de ayuda
    type: String,
  },
  audio: {
    // Opcional: ruta a un archivo de audio
    type: String,
  },
});

// Índice para búsquedas rápidas
wordSchema.index({ difficulty: 1, chapter: 1 });

module.exports = mongoose.model("Word", wordSchema);
