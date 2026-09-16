# WSECOLIM

Webservice (API REST) para la gestión de productos de **ECOLIM S.A.C.**, desarrollado como parte del proyecto final del curso de Software Engineering with AI (SENATI). Este webservice es consumido por la app Android **ECOLIM**.

## Tecnologías utilizadas

- **Node.js** — entorno de ejecución de JavaScript en el servidor
- **Express** — framework para construir el webservice y definir las rutas
- **MySQL (mysql2)** — motor de base de datos, usado con **pool de conexiones** y soporte de promesas (`async/await`)
- **dotenv** — manejo de variables de entorno (credenciales de BD, puerto)

## Estructura del proyecto

```
WSECOLIM/
├── .env.example        # Plantilla de variables de entorno (sin datos sensibles)
├── .gitignore
├── database.sql         # Script de creación de BD + datos semilla
├── db.js                # Configuración del pool de conexión a MySQL
├── index.js             # Definición del servidor y las rutas (endpoints)
└── package.json
```

## Modelo de base de datos

Tabla `productos`:

| Campo       | Tipo             | Notas                          |
|-------------|------------------|----------------------------------|
| id          | INT (PK, AI)     | Autoincremental                  |
| nombre      | VARCHAR(60)      | Obligatorio                      |
| categoria   | VARCHAR(40)      | Obligatorio                      |
| descripcion | VARCHAR(200)     | Opcional                         |
| garantia    | VARCHAR(40)      | Opcional                         |
| precio      | DECIMAL(10,2)    | Obligatorio (2 decimales exactos)|
| stock       | INT              | Por defecto 0                    |
| create_at   | DATETIME         | Se llena automáticamente         |
| update_at   | DATETIME         | Se actualiza en cada UPDATE      |

## Arquitectura del webservice

- **Pool de conexiones** (`db.js`): en vez de una única conexión a MySQL, se usa un pool (`mysql.createPool`), que permite atender varias peticiones simultáneas sin saturar la base de datos.
- **Variables de entorno** (`.env`): las credenciales de la BD y el puerto del servidor no están escritas directamente en el código, sino leídas mediante `dotenv`.
- **Manejo de errores con `try/catch`**: cada endpoint envuelve su lógica en un bloque `try/catch`.
- **Validación de datos**: antes de insertar o actualizar un producto, se valida que los campos obligatorios (nombre, categoría, precio) no vengan vacíos.

## Endpoints

| Proceso  | Verbo  | Endpoint           | Body (JSON)                                                     | Respuesta |
|----------|--------|---------------------|--------------------------------------------------------------------|-----------|
| Create   | POST   | `/productos`        | `nombre, categoria, descripcion, garantia, precio, stock`         | `{ success, message, id }` |
| Read     | GET    | `/productos`        | —                                                                   | Array de productos |
| Search   | GET    | `/productos/:id`    | —                                                                   | Objeto del producto / 404 |
| Update   | PUT    | `/productos/:id`    | `nombre, categoria, descripcion, garantia, precio, stock`         | `{ success, message }` |
| Delete   | DELETE | `/productos/:id`    | —                                                                   | `{ success, message }` |

> **Nota:** `Read` y `Search` devuelven los datos directamente (sin envolver en `{success, data}`), para que coincidan con el formato que espera la app Android (Volley `JsonArrayRequest`/`JsonObjectRequest`). `Create`, `Update` y `Delete` sí usan el formato `{success, message}`.

## Instalación y ejecución

1. Clonar el repositorio
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Copiar `.env.example` a `.env` y completar con tus propios datos:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=ECOLIM
   DB_PORT=3306
   PORT=3000
   ```
4. Ejecutar el script `database.sql` en MySQL para crear la base de datos y la tabla `productos`.
5. Iniciar el servidor:
   ```bash
   node index.js
   ```
   El servidor queda disponible en `http://localhost:3000`.

## Estado actual

- [x] Conexión mediante pool + `.env`
- [x] CRUD completo (Create, Read, Search, Update, Delete)
- [x] Validación de campos obligatorios
- [x] Manejo de errores con `try/catch`
- [x] Formato de respuesta ajustado para consumo desde la app Android
- [x] Probado con Thunder Client y desde la app ECOLIM
