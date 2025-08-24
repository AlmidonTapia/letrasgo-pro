# LetrasGo Pro API - Testing con Postman

## Configuración Base

**Base URL:** `http://localhost:3000/api`

**Headers necesarios para todas las peticiones:**
```
Content-Type: application/json
```

**Para rutas protegidas, agregar:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 1. AUTENTICACIÓN

### 1.1 Registro de Usuario
**POST** `/auth/register`

**Body (JSON):**
```json
{
  "username": "testuser",
  "password": "1234"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c8b1f8e4a1b2",
      "username": "testuser",
      "score": 0,
      "progress": {
        "words": {
          "easy": { "unlocked": 1 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        },
        "sentences": {
          "easy": { "unlocked": 1 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        }
      }
    }
  }
}
```

### 1.2 Login de Usuario
**POST** `/auth/login`

**Body (JSON):**
```json
{
  "username": "testuser",
  "password": "1234"
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d5ec49f1b2c8b1f8e4a1b2",
      "username": "testuser",
      "score": 150,
      "progress": {
        "words": {
          "easy": { "unlocked": 3 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        },
        "sentences": {
          "easy": { "unlocked": 2 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        }
      }
    }
  }
}
```

### 1.3 Verificar Autenticación
**GET** `/auth/check`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "isAuthenticated": true,
    "user": {
      "id": "60d5ec49f1b2c8b1f8e4a1b2",
      "username": "testuser",
      "score": 150,
      "progress": {
        "words": {
          "easy": { "unlocked": 3 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        },
        "sentences": {
          "easy": { "unlocked": 2 },
          "normal": { "unlocked": 1 },
          "difficult": { "unlocked": 1 }
        }
      }
    }
  }
}
```

### 1.4 Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada con éxito."
}
```

---

## 2. CONTENIDO DEL JUEGO

### 2.1 Obtener Contenido de Palabras
**GET** `/game/content/words/easy/1`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4a1b3",
    "difficulty": "facil",
    "chapter": 1,
    "solution": "casa",
    "syllables": ["ca", "sa"],
    "image": "images/words/facil/casa.png",
    "audio": "audio/words/facil/casa.mp3"
  }
}
```

### 2.2 Obtener Contenido de Oraciones
**GET** `/game/content/sentences/normal/2`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c8b1f8e4a1b4",
    "difficulty": "normal",
    "chapter": 2,
    "solution": "Los niños juegan en el parque",
    "words": ["Los", "niños", "juegan", "en", "el", "parque"],
    "image": "images/sentences/normal/ninos_parque.png",
    "audio": "audio/sentences/normal/2.mp3"
  }
}
```

### 2.3 Actualizar Progreso
**PUT** `/game/progress`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "mode": "words",
  "difficulty": "easy",
  "chapter": 1,
  "scoreToAdd": 10
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Progreso actualizado.",
  "data": {
    "score": 160,
    "progress": {
      "words": {
        "easy": { "unlocked": 2 },
        "normal": { "unlocked": 1 },
        "difficult": { "unlocked": 1 }
      },
      "sentences": {
        "easy": { "unlocked": 2 },
        "normal": { "unlocked": 1 },
        "difficult": { "unlocked": 1 }
      }
    }
  }
}
```

---

## 3. ERRORES COMUNES

### 3.1 Token Inválido o Expirado (401)
```json
{
  "success": false,
  "message": "Token no válido"
}
```

### 3.2 Usuario no autorizado (401)
```json
{
  "success": false,
  "message": "No autorizado, no hay token"
}
```

### 3.3 Contenido no encontrado (404)
```json
{
  "success": false,
  "message": "Contenido no encontrado para este nivel."
}
```

### 3.4 Datos faltantes (400)
```json
{
  "success": false,
  "message": "Faltan parámetros requeridos."
}
```

---

## 4. FLUJO DE TESTING RECOMENDADO

1. **Registro:** POST `/auth/register` - Guardar el token de la respuesta
2. **Login:** POST `/auth/login` - Verificar que funciona con el usuario creado
3. **Verificar Auth:** GET `/auth/check` - Confirmar que el token es válido
4. **Obtener Contenido:** GET `/game/content/words/easy/1` - Probar carga de contenido
5. **Actualizar Progreso:** PUT `/game/progress` - Probar actualización de progreso
6. **Logout:** POST `/auth/logout` - Cerrar sesión
7. **Verificar Auth (sin token):** GET `/auth/check` - Debe fallar sin token

---

## 5. COLECCIÓN POSTMAN

Para facilitar el testing, importa estos ejemplos como una colección en Postman:

1. Crear nueva colección "LetrasGo Pro API"
2. Agregar variable de entorno `base_url` = `http://localhost:3000/api`
3. Agregar variable de entorno `token` para almacenar el JWT
4. Configurar script post-request para capturar automáticamente el token:

```javascript
// En Tests tab de register/login requests:
if (pm.response.json().data && pm.response.json().data.token) {
    pm.environment.set("token", pm.response.json().data.token);
}
```

5. En rutas protegidas, usar `Bearer {{token}}` en Authorization header.
