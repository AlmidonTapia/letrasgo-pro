const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
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
    // La oración correcta
    type: String,
    required: true,
  },
  words: {
    // Las palabras desordenadas para mostrar
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
sentenceSchema.index({ difficulty: 1, chapter: 1 });

module.exports = mongoose.model("Sentence", sentenceSchema);
