// Para ejecutar: node src/util/seedDatabase.js
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Word = require("../models/wordModel");
const Sentence = require("../models/sentenceModel");

// Función para cargar datos JSON
function loadJsonData(filename) {
  const filePath = path.join(__dirname, "../../data", filename);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al cargar ${filename}:`, error);
    return [];
  }
}

// Cargar datos de los archivos JSON
const wordsEasy = loadJsonData("palabras-facil.json");
const wordsNormal = loadJsonData("palabras-normal.json");
const wordsDifficult = loadJsonData("palabras-dificil.json");

const sentencesEasy = loadJsonData("oraciones-facil.json");
const sentencesNormal = loadJsonData("oraciones-normal.json");
const sentencesDifficult = loadJsonData("oraciones-dificil.json");

// Mapear dificultades
const difficultyMap = {
  easy: "facil",
  normal: "normal",
  difficult: "dificil",
};

// Convertir formato de palabras
const wordsToSeed = [
  ...wordsEasy.map((word) => ({
    difficulty: difficultyMap[word.difficulty],
    chapter: word.chapter,
    solution: word.solution,
    syllables: word.syllables,
    image: word.image,
    audio: word.audio,
  })),
  ...wordsNormal.map((word) => ({
    difficulty: difficultyMap[word.difficulty],
    chapter: word.chapter,
    solution: word.solution,
    syllables: word.syllables,
    image: word.image,
    audio: word.audio,
  })),
  ...wordsDifficult.map((word) => ({
    difficulty: difficultyMap[word.difficulty],
    chapter: word.chapter,
    solution: word.solution,
    syllables: word.syllables,
    image: word.image,
    audio: word.audio,
  })),
];

// Convertir formato de oraciones
const sentencesToSeed = [
  ...sentencesEasy.map((sentence) => ({
    difficulty: difficultyMap[sentence.difficulty],
    chapter: sentence.chapter,
    solution: sentence.solution,
    words: sentence.words,
    image: sentence.image,
    audio: sentence.audio,
  })),
  ...sentencesNormal.map((sentence) => ({
    difficulty: difficultyMap[sentence.difficulty],
    chapter: sentence.chapter,
    solution: sentence.solution,
    words: sentence.words,
    image: sentence.image,
    audio: sentence.audio,
  })),
  ...sentencesDifficult.map((sentence) => ({
    difficulty: difficultyMap[sentence.difficulty],
    chapter: sentence.chapter,
    solution: sentence.solution,
    words: sentence.words,
    image: sentence.image,
    audio: sentence.audio,
  })),
];

async function seedDatabase() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    // Limpiar datos existentes
    await Word.deleteMany({});
    await Sentence.deleteMany({});
    console.log("Datos anteriores limpiados");

    // Insertar palabras
    await Word.insertMany(wordsToSeed);
    console.log(`${wordsToSeed.length} palabras insertadas`);

    // Insertar oraciones
    await Sentence.insertMany(sentencesToSeed);
    console.log(`${sentencesToSeed.length} oraciones insertadas`);

    console.log("Base de datos poblada exitosamente");
  } catch (error) {
    console.error("Error al poblar la base de datos:", error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log("Conexión cerrada");
  }
}

// Ejecutar el script
seedDatabase();
