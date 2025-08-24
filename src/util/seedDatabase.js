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

// Función para procesar datos de archivos JSON
function processWordsFromJson(jsonData, difficulty, defaultChapter = 1) {
  if (!Array.isArray(jsonData)) return [];

  return jsonData.map((word, index) => ({
    difficulty: difficulty,
    chapter: word.chapter || defaultChapter + index,
    solution: word.word || word.solution || word.text,
    syllables: word.syllables || [word.word || word.solution || word.text],
    image:
      word.image ||
      `images/words/${difficulty}/${
        word.word || word.solution || "default"
      }.png`,
    audio:
      word.audio ||
      `audio/words/${difficulty}/${
        word.word || word.solution || "default"
      }.mp3`,
  }));
}

function processSentencesFromJson(jsonData, difficulty, defaultChapter = 1) {
  if (!Array.isArray(jsonData)) return [];

  return jsonData.map((sentence, index) => ({
    difficulty: difficulty,
    chapter: sentence.chapter || defaultChapter + index,
    solution: sentence.sentence || sentence.solution || sentence.text,
    words:
      sentence.words ||
      (sentence.sentence || sentence.solution || sentence.text).split(" "),
    image: sentence.image || `images/sentences/${difficulty}/${index + 1}.png`,
    audio: sentence.audio || `audio/sentences/${difficulty}/${index + 1}.mp3`,
  }));
}

// Función para crear datos de ejemplo si no existen en JSON
function createSampleData() {
  const sampleWords = [
    // Fácil
    {
      difficulty: "facil",
      chapter: 1,
      solution: "casa",
      syllables: ["ca", "sa"],
      image: "images/words/facil/casa.png",
      audio: "audio/words/facil/casa.mp3",
    },
    {
      difficulty: "facil",
      chapter: 2,
      solution: "gato",
      syllables: ["ga", "to"],
      image: "images/words/facil/gato.png",
      audio: "audio/words/facil/gato.mp3",
    },
    {
      difficulty: "facil",
      chapter: 3,
      solution: "mesa",
      syllables: ["me", "sa"],
      image: "images/words/facil/mesa.png",
      audio: "audio/words/facil/mesa.mp3",
    },
    {
      difficulty: "facil",
      chapter: 4,
      solution: "mama",
      syllables: ["ma", "má"],
      image: "images/words/facil/mama.png",
      audio: "audio/words/facil/mama.mp3",
    },
    {
      difficulty: "facil",
      chapter: 5,
      solution: "luna",
      syllables: ["lu", "na"],
      image: "images/words/facil/luna.png",
      audio: "audio/words/facil/luna.mp3",
    },
    {
      difficulty: "facil",
      chapter: 6,
      solution: "mono",
      syllables: ["mo", "no"],
      image: "images/words/facil/mono.png",
      audio: "audio/words/facil/mono.mp3",
    },
    {
      difficulty: "facil",
      chapter: 7,
      solution: "nube",
      syllables: ["nu", "be"],
      image: "images/words/facil/nube.png",
      audio: "audio/words/facil/nube.mp3",
    },
    {
      difficulty: "facil",
      chapter: 8,
      solution: "leon",
      syllables: ["le", "ón"],
      image: "images/words/facil/leon.png",
      audio: "audio/words/facil/leon.mp3",
    },
    {
      difficulty: "facil",
      chapter: 9,
      solution: "mapa",
      syllables: ["ma", "pa"],
      image: "images/words/facil/mapa.png",
      audio: "audio/words/facil/mapa.mp3",
    },
    {
      difficulty: "facil",
      chapter: 10,
      solution: "puerta",
      syllables: ["puer", "ta"],
      image: "images/words/facil/puerta.png",
      audio: "audio/words/facil/puerta.mp3",
    },

    // Normal
    {
      difficulty: "normal",
      chapter: 1,
      solution: "caballo",
      syllables: ["ca", "ba", "llo"],
      image: "images/words/normal/caballo.png",
      audio: "audio/words/normal/caballo.mp3",
    },
    {
      difficulty: "normal",
      chapter: 2,
      solution: "escuela",
      syllables: ["es", "cue", "la"],
      image: "images/words/normal/escuela.png",
      audio: "audio/words/normal/escuela.mp3",
    },
    {
      difficulty: "normal",
      chapter: 3,
      solution: "pelota",
      syllables: ["pe", "lo", "ta"],
      image: "images/words/normal/pelota.png",
      audio: "audio/words/normal/pelota.mp3",
    },
    {
      difficulty: "normal",
      chapter: 4,
      solution: "ventana",
      syllables: ["ven", "ta", "na"],
      image: "images/words/normal/ventana.png",
      audio: "audio/words/normal/ventana.mp3",
    },
    {
      difficulty: "normal",
      chapter: 5,
      solution: "familia",
      syllables: ["fa", "mi", "lia"],
      image: "images/words/normal/familia.png",
      audio: "audio/words/normal/familia.mp3",
    },
    {
      difficulty: "normal",
      chapter: 6,
      solution: "comida",
      syllables: ["co", "mi", "da"],
      image: "images/words/normal/comida.png",
      audio: "audio/words/normal/comida.mp3",
    },
    {
      difficulty: "normal",
      chapter: 7,
      solution: "jardin",
      syllables: ["jar", "dín"],
      image: "images/words/normal/jardin.png",
      audio: "audio/words/normal/jardin.mp3",
    },
    {
      difficulty: "normal",
      chapter: 8,
      solution: "musica",
      syllables: ["mú", "si", "ca"],
      image: "images/words/normal/musica.png",
      audio: "audio/words/normal/musica.mp3",
    },
    {
      difficulty: "normal",
      chapter: 9,
      solution: "camino",
      syllables: ["ca", "mi", "no"],
      image: "images/words/normal/camino.png",
      audio: "audio/words/normal/camino.mp3",
    },
    {
      difficulty: "normal",
      chapter: 10,
      solution: "amigos",
      syllables: ["a", "mi", "gos"],
      image: "images/words/normal/amigos.png",
      audio: "audio/words/normal/amigos.mp3",
    },

    // Difícil
    {
      difficulty: "dificil",
      chapter: 1,
      solution: "mariposa",
      syllables: ["ma", "ri", "po", "sa"],
      image: "images/words/dificil/mariposa.png",
      audio: "audio/words/dificil/mariposa.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 2,
      solution: "dinosaurio",
      syllables: ["di", "no", "sau", "rio"],
      image: "images/words/dificil/dinosaurio.png",
      audio: "audio/words/dificil/dinosaurio.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 3,
      solution: "helicoptero",
      syllables: ["he", "li", "cóp", "te", "ro"],
      image: "images/words/dificil/helicoptero.png",
      audio: "audio/words/dificil/helicoptero.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 4,
      solution: "refrigerador",
      syllables: ["re", "fri", "ge", "ra", "dor"],
      image: "images/words/dificil/refrigerador.png",
      audio: "audio/words/dificil/refrigerador.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 5,
      solution: "computadora",
      syllables: ["com", "pu", "ta", "do", "ra"],
      image: "images/words/dificil/computadora.png",
      audio: "audio/words/dificil/computadora.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 6,
      solution: "telefono",
      syllables: ["te", "lé", "fo", "no"],
      image: "images/words/dificil/telefono.png",
      audio: "audio/words/dificil/telefono.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 7,
      solution: "biblioteca",
      syllables: ["bi", "blio", "te", "ca"],
      image: "images/words/dificil/biblioteca.png",
      audio: "audio/words/dificil/biblioteca.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 8,
      solution: "universo",
      syllables: ["u", "ni", "ver", "so"],
      image: "images/words/dificil/universo.png",
      audio: "audio/words/dificil/universo.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 9,
      solution: "exploracion",
      syllables: ["ex", "plo", "ra", "ción"],
      image: "images/words/dificil/exploracion.png",
      audio: "audio/words/dificil/exploracion.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 10,
      solution: "imaginacion",
      syllables: ["i", "ma", "gi", "na", "ción"],
      image: "images/words/dificil/imaginacion.png",
      audio: "audio/words/dificil/imaginacion.mp3",
    },
  ];

  const sampleSentences = [
    // Fácil
    {
      difficulty: "facil",
      chapter: 1,
      solution: "El gato come",
      words: ["El", "gato", "come"],
      image: "images/sentences/facil/gato_come.png",
      audio: "audio/sentences/facil/1.mp3",
    },
    {
      difficulty: "facil",
      chapter: 2,
      solution: "Mamá cocina",
      words: ["Mamá", "cocina"],
      image: "images/sentences/facil/mama_cocina.png",
      audio: "audio/sentences/facil/2.mp3",
    },
    {
      difficulty: "facil",
      chapter: 3,
      solution: "Papá lee",
      words: ["Papá", "lee"],
      image: "images/sentences/facil/papa_lee.png",
      audio: "audio/sentences/facil/3.mp3",
    },
    {
      difficulty: "facil",
      chapter: 4,
      solution: "El sol brilla",
      words: ["El", "sol", "brilla"],
      image: "images/sentences/facil/sol_brilla.png",
      audio: "audio/sentences/facil/4.mp3",
    },
    {
      difficulty: "facil",
      chapter: 5,
      solution: "La niña juega",
      words: ["La", "niña", "juega"],
      image: "images/sentences/facil/nina_juega.png",
      audio: "audio/sentences/facil/5.mp3",
    },
    {
      difficulty: "facil",
      chapter: 6,
      solution: "Mi perro corre",
      words: ["Mi", "perro", "corre"],
      image: "images/sentences/facil/perro_corre.png",
      audio: "audio/sentences/facil/6.mp3",
    },
    {
      difficulty: "facil",
      chapter: 7,
      solution: "La casa azul",
      words: ["La", "casa", "azul"],
      image: "images/sentences/facil/casa_azul.png",
      audio: "audio/sentences/facil/7.mp3",
    },
    {
      difficulty: "facil",
      chapter: 8,
      solution: "Los niños ríen",
      words: ["Los", "niños", "ríen"],
      image: "images/sentences/facil/ninos_rien.png",
      audio: "audio/sentences/facil/8.mp3",
    },
    {
      difficulty: "facil",
      chapter: 9,
      solution: "Mi mamá sonríe",
      words: ["Mi", "mamá", "sonríe"],
      image: "images/sentences/facil/mama_sonrie.png",
      audio: "audio/sentences/facil/9.mp3",
    },
    {
      difficulty: "facil",
      chapter: 10,
      solution: "El árbol crece",
      words: ["El", "árbol", "crece"],
      image: "images/sentences/facil/arbol_crece.png",
      audio: "audio/sentences/facil/10.mp3",
    },

    // Normal
    {
      difficulty: "normal",
      chapter: 1,
      solution: "Los niños juegan en el parque",
      words: ["Los", "niños", "juegan", "en", "el", "parque"],
      image: "images/sentences/normal/ninos_parque.png",
      audio: "audio/sentences/normal/1.mp3",
    },
    {
      difficulty: "normal",
      chapter: 2,
      solution: "Mi familia va de paseo",
      words: ["Mi", "familia", "va", "de", "paseo"],
      image: "images/sentences/normal/familia_paseo.png",
      audio: "audio/sentences/normal/2.mp3",
    },
    {
      difficulty: "normal",
      chapter: 3,
      solution: "El perro corre rápido",
      words: ["El", "perro", "corre", "rápido"],
      image: "images/sentences/normal/perro_corre.png",
      audio: "audio/sentences/normal/3.mp3",
    },
    {
      difficulty: "normal",
      chapter: 4,
      solution: "La maestra enseña matemáticas",
      words: ["La", "maestra", "enseña", "matemáticas"],
      image: "images/sentences/normal/maestra_ensena.png",
      audio: "audio/sentences/normal/4.mp3",
    },
    {
      difficulty: "normal",
      chapter: 5,
      solution: "Los pájaros vuelan alto",
      words: ["Los", "pájaros", "vuelan", "alto"],
      image: "images/sentences/normal/pajaros_vuelan.png",
      audio: "audio/sentences/normal/5.mp3",
    },
    {
      difficulty: "normal",
      chapter: 6,
      solution: "Mi hermana toca piano",
      words: ["Mi", "hermana", "toca", "piano"],
      image: "images/sentences/normal/hermana_piano.png",
      audio: "audio/sentences/normal/6.mp3",
    },
    {
      difficulty: "normal",
      chapter: 7,
      solution: "El jardín tiene flores",
      words: ["El", "jardín", "tiene", "flores"],
      image: "images/sentences/normal/jardin_flores.png",
      audio: "audio/sentences/normal/7.mp3",
    },
    {
      difficulty: "normal",
      chapter: 8,
      solution: "Los estudiantes aprenden ciencias",
      words: ["Los", "estudiantes", "aprenden", "ciencias"],
      image: "images/sentences/normal/estudiantes_ciencias.png",
      audio: "audio/sentences/normal/8.mp3",
    },
    {
      difficulty: "normal",
      chapter: 9,
      solution: "La biblioteca tiene muchos libros",
      words: ["La", "biblioteca", "tiene", "muchos", "libros"],
      image: "images/sentences/normal/biblioteca_libros.png",
      audio: "audio/sentences/normal/9.mp3",
    },
    {
      difficulty: "normal",
      chapter: 10,
      solution: "El museo exhibe arte",
      words: ["El", "museo", "exhibe", "arte"],
      image: "images/sentences/normal/museo_arte.png",
      audio: "audio/sentences/normal/10.mp3",
    },

    // Difícil
    {
      difficulty: "dificil",
      chapter: 1,
      solution: "Los científicos investigan nuevos descubrimientos",
      words: ["Los", "científicos", "investigan", "nuevos", "descubrimientos"],
      image: "images/sentences/dificil/cientificos_descubrimientos.png",
      audio: "audio/sentences/dificil/1.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 2,
      solution: "La tecnología avanza constantemente",
      words: ["La", "tecnología", "avanza", "constantemente"],
      image: "images/sentences/dificil/tecnologia_avanza.png",
      audio: "audio/sentences/dificil/2.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 3,
      solution: "Los arqueólogos encuentran tesoros antiguos",
      words: ["Los", "arqueólogos", "encuentran", "tesoros", "antiguos"],
      image: "images/sentences/dificil/arqueologos_tesoros.png",
      audio: "audio/sentences/dificil/3.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 4,
      solution: "El astronauta explora el espacio",
      words: ["El", "astronauta", "explora", "el", "espacio"],
      image: "images/sentences/dificil/astronauta_espacio.png",
      audio: "audio/sentences/dificil/4.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 5,
      solution: "Los médicos curan enfermedades",
      words: ["Los", "médicos", "curan", "enfermedades"],
      image: "images/sentences/dificil/medicos_curan.png",
      audio: "audio/sentences/dificil/5.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 6,
      solution: "La naturaleza necesita protección",
      words: ["La", "naturaleza", "necesita", "protección"],
      image: "images/sentences/dificil/naturaleza_proteccion.png",
      audio: "audio/sentences/dificil/6.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 7,
      solution: "Los ingenieros construyen puentes",
      words: ["Los", "ingenieros", "construyen", "puentes"],
      image: "images/sentences/dificil/ingenieros_puentes.png",
      audio: "audio/sentences/dificil/7.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 8,
      solution: "La educación transforma sociedades",
      words: ["La", "educación", "transforma", "sociedades"],
      image: "images/sentences/dificil/educacion_sociedades.png",
      audio: "audio/sentences/dificil/8.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 9,
      solution: "Los artistas expresan emociones",
      words: ["Los", "artistas", "expresan", "emociones"],
      image: "images/sentences/dificil/artistas_emociones.png",
      audio: "audio/sentences/dificil/9.mp3",
    },
    {
      difficulty: "dificil",
      chapter: 10,
      solution: "La imaginación crea mundos fantásticos",
      words: ["La", "imaginación", "crea", "mundos", "fantásticos"],
      image: "images/sentences/dificil/imaginacion_mundos.png",
      audio: "audio/sentences/dificil/10.mp3",
    },
  ];

  return { sampleWords, sampleSentences };
}

// Función principal para poblar la base de datos
async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seedDatabase...");

    // Conectar a MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/letrasgo",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Conectado a MongoDB");

    // Limpiar datos existentes
    await Word.deleteMany({});
    await Sentence.deleteMany({});
    console.log("🧹 Datos existentes eliminados");

    // Preparar datos
    let wordsToInsert = [];
    let sentencesToInsert = [];

    // Obtener datos de ejemplo de respaldo
    const { sampleWords, sampleSentences } = createSampleData();

    // Procesar palabras desde archivos JSON o usar datos de ejemplo
    if (wordsEasy.length > 0) {
      wordsToInsert = wordsToInsert.concat(
        processWordsFromJson(wordsEasy, "facil")
      );
    } else {
      wordsToInsert = wordsToInsert.concat(
        sampleWords.filter((w) => w.difficulty === "facil")
      );
    }

    if (wordsNormal.length > 0) {
      wordsToInsert = wordsToInsert.concat(
        processWordsFromJson(wordsNormal, "normal")
      );
    } else {
      wordsToInsert = wordsToInsert.concat(
        sampleWords.filter((w) => w.difficulty === "normal")
      );
    }

    if (wordsDifficult.length > 0) {
      wordsToInsert = wordsToInsert.concat(
        processWordsFromJson(wordsDifficult, "dificil")
      );
    } else {
      wordsToInsert = wordsToInsert.concat(
        sampleWords.filter((w) => w.difficulty === "dificil")
      );
    }

    // Procesar oraciones desde archivos JSON o usar datos de ejemplo
    if (sentencesEasy.length > 0) {
      sentencesToInsert = sentencesToInsert.concat(
        processSentencesFromJson(sentencesEasy, "facil")
      );
    } else {
      sentencesToInsert = sentencesToInsert.concat(
        sampleSentences.filter((s) => s.difficulty === "facil")
      );
    }

    if (sentencesNormal.length > 0) {
      sentencesToInsert = sentencesToInsert.concat(
        processSentencesFromJson(sentencesNormal, "normal")
      );
    } else {
      sentencesToInsert = sentencesToInsert.concat(
        sampleSentences.filter((s) => s.difficulty === "normal")
      );
    }

    if (sentencesDifficult.length > 0) {
      sentencesToInsert = sentencesToInsert.concat(
        processSentencesFromJson(sentencesDifficult, "dificil")
      );
    } else {
      sentencesToInsert = sentencesToInsert.concat(
        sampleSentences.filter((s) => s.difficulty === "dificil")
      );
    }

    // Insertar palabras
    if (wordsToInsert.length > 0) {
      await Word.insertMany(wordsToInsert);
      console.log(`✅ ${wordsToInsert.length} palabras insertadas`);
    }

    // Insertar oraciones
    if (sentencesToInsert.length > 0) {
      await Sentence.insertMany(sentencesToInsert);
      console.log(`✅ ${sentencesToInsert.length} oraciones insertadas`);
    }

    // Mostrar resumen
    const wordCount = await Word.countDocuments();
    const sentenceCount = await Sentence.countDocuments();

    console.log("\n📊 Resumen de la base de datos:");
    console.log(`📝 Total palabras: ${wordCount}`);
    console.log(`📑 Total oraciones: ${sentenceCount}`);

    // Mostrar por dificultad
    for (const difficulty of ["facil", "normal", "dificil"]) {
      const wordsByDiff = await Word.countDocuments({ difficulty });
      const sentencesByDiff = await Sentence.countDocuments({ difficulty });
      console.log(
        `   ${difficulty}: ${wordsByDiff} palabras, ${sentencesByDiff} oraciones`
      );
    }

    console.log("\n🎉 Base de datos poblada exitosamente!");
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión a MongoDB cerrada");
  }
}

// Ejecutar el script si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
