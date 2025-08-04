# LetrasGo Pro - Juego Educativo

Un juego educativo interactivo para aprender palabras y oraciones en español.

## Características

- **Modo Palabras**: Construye palabras arrastrando sílabas
- **Modo Oraciones**: Construye oraciones arrastrando palabras
- **Tres niveles de dificultad**: Fácil, Normal y Difícil
- **10 capítulos por nivel**
- **Sistema de progreso**: Desbloquea capítulos al completar niveles
- **Interfaz moderna y atractiva**
- **Sonidos y efectos visuales**

## Estructura del Proyecto

```
letrasgo-pro/
├── public/                 # Archivos del frontend
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript del cliente
│   ├── images/            # Imágenes del juego
│   ├── audio/             # Archivos de audio
│   ├── fonts/             # Fuentes personalizadas
│   ├── game.html          # Página principal del juego
│   └── landing.html       # Página de inicio
├── src/                   # Código del backend
│   ├── api/               # API y controladores
│   ├── models/            # Modelos de MongoDB
│   ├── util/              # Utilidades y scripts
│   └── app.js             # Servidor principal
├── data/                  # Datos JSON del juego
│   ├── palabras-facil.json
│   ├── palabras-normal.json
│   ├── palabras-dificil.json
│   ├── oraciones-facil.json
│   ├── oraciones-normal.json
│   └── oraciones-dificil.json
└── package.json
```

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd letrasgo-pro
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Configura tu URI de MongoDB
   - Configura tu clave secreta de sesión

4. Inicia MongoDB (si usas instalación local):
```bash
mongod
```

5. Poblar la base de datos con datos iniciales:
```bash
npm run seed
```

6. Inicia el servidor:
```bash
npm start
```

## Uso

1. Abre tu navegador y ve a `http://localhost:3000`
2. Regístrate o inicia sesión
3. Selecciona un modo de juego (Palabras u Oraciones)
4. Elige tu nivel de dificultad
5. Selecciona un capítulo
6. ¡Juega y aprende!

## Scripts Disponibles

- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm run seed` - Pobla la base de datos con datos iniciales

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB con Mongoose
- express-session para manejo de sesiones
- bcrypt para encriptación de contraseñas

### Frontend
- HTML5
- CSS3
- JavaScript ES6+
- GSAP para animaciones
- Draggable.js para interacciones drag & drop

## Configuración de Datos

Los datos del juego se almacenan en archivos JSON en la carpeta `data/`:

- `palabras-facil.json` - Palabras de nivel fácil
- `palabras-normal.json` - Palabras de nivel normal
- `palabras-dificil.json` - Palabras de nivel difícil
- `oraciones-facil.json` - Oraciones de nivel fácil
- `oraciones-normal.json` - Oraciones de nivel normal
- `oraciones-dificil.json` - Oraciones de nivel difícil

Cada archivo contiene un array de objetos con la estructura:

Para palabras:
```json
{
  "difficulty": "easy",
  "chapter": 1,
  "word": "CASA",
  "syllables": ["CA", "SA"],
  "solution": "CASA",
  "image": "images/words/facil/casa.png",
  "audio": "audio/words/facil/casa.mp3"
}
```

Para oraciones:
```json
{
  "difficulty": "easy",
  "chapter": 1,
  "sentence": "EL GATO DUERME",
  "words": ["EL", "GATO", "DUERME"],
  "solution": "EL GATO DUERME",
  "image": "images/sentences/facil/gato_duerme.png",
  "audio": "audio/sentences/facil/gato_duerme.mp3"
}
```

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añade nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

ALMTS - Juego Educativo LetrasGo Pro
