const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Esquema para el progreso en un nivel de dificultad específico
const progressSchema = new mongoose.Schema(
  {
    unlocked: { type: Number, default: 1 }, // Capítulo desbloqueado
  },
  { _id: false }
);

// Esquema para un modo de juego (Palabras o Oraciones)
const gameModeSchema = new mongoose.Schema(
  {
    easy: { type: progressSchema, default: () => ({}) },
    normal: { type: progressSchema, default: () => ({}) },
    difficult: { type: progressSchema, default: () => ({}) },
  },
  { _id: false }
);

// Esquema principal del Usuario
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "El nombre de usuario es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    score: {
      type: Number,
      default: 0,
    },
    progress: {
      words: { type: gameModeSchema, default: () => ({}) },
      sentences: { type: gameModeSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña ingresada con la hasheada
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
