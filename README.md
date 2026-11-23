# Preparcial: sistema de usuarios y roles

API en **NestJS** con autenticación por JWT (access token y refresh token), autorización por roles con policies y persistencia en **PostgreSQL** (relación muchos a muchos entre usuarios y roles).

Programación con Tecnologías Web (ISIS3710).

## Tecnologías

- NestJS 12
- `@nestjs/authentication`: login, JWT, refresh tokens y hash de contraseñas (scrypt)
- `@nestjs/authorization`: policies con `@Can()`
- TypeORM + PostgreSQL 17 (en Docker)
- class-validator para validar las entradas

## Requisitos

- Node.js 20.19 o superior
- Docker Desktop

## Instalación y ejecución

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/LucasValbuena1/parcial-2-web.git
cd parcial-2-web
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env
#    y cambiar JWT_SECRET por un valor aleatorio:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Levantar PostgreSQL
docker compose up -d
docker compose ps          # parcial_db debe aparecer como "Up"

# 4. Arrancar la API (http://localhost:3000)
npm run start:dev
```

Al arrancar, TypeORM crea las tablas `users`, `roles` y `users_roles` a partir de las entidades (`synchronize: true`).

## Variables de entorno

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5433` | Puerto publicado por Docker (5433 para no chocar con otro Postgres en el 5432) |
| `DB_USER` | `parcial` | Usuario de la base |
| `DB_PASS` | `parcial123` | Contraseña de la base |
| `DB_NAME` | `parcial_db` | Nombre de la base |
| `JWT_SECRET` | (64 caracteres hex) | Clave para firmar los tokens. Mínimo 32 caracteres aleatorios |
| `JWT_EXPIRES_IN` | `2m` | Duración del access token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Duración del refresh token |

Los valores de la base coinciden con `docker-compose.yml`. Si cambias uno, cámbialo en los dos archivos.

## Base de datos

La base corre en el contenedor `parcial_db` y guarda los datos en el volumen `datos`, así que se mantienen al reiniciar.

Scripts en la carpeta `db/`:

| Archivo | Contenido |
|---|---|
| `db/init.sql` | Migración inicial: crea las tablas `users`, `roles` y `users_roles` |
| `db/poblar.sql` | Datos de prueba: roles, usuarios y sus asignaciones |

Para ejecutar un script:

```bash
docker exec -i parcial_db psql -U parcial -d parcial_db < db/poblar.sql
```

Para borrar todo y empezar de cero:

```bash
docker compose down -v     # -v borra el volumen con los datos
docker compose up -d
npm run start:dev          # vuelve a crear las tablas vacías
```

### Crear el primer admin

Asignar roles exige ser admin, así que el primero se asigna por SQL:

```bash
# 1. Registrar el usuario con la API
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parcial.com","password":"una-clave-larga-123","name":"Admin"}'

# 2. Crear el rol admin (si no existe) y asignárselo
docker exec -i parcial_db psql -U parcial -d parcial_db -c "
  INSERT INTO roles (role_name, description) VALUES ('admin', 'Administrador')
  ON CONFLICT (role_name) DO NOTHING;
  INSERT INTO users_roles (user_id, role_id)
  SELECT u.id, r.id FROM users u, roles r
  WHERE u.email = 'admin@parcial.com' AND r.role_name = 'admin';"
```

Desde ahí, el admin asigna roles a los demás con `PATCH /users/:id/roles`.

## Endpoints

Las rutas protegidas reciben el token en el header `Authorization: Bearer <accessToken>`.

| Método | Ruta | Acceso | Respuesta exitosa |
|---|---|---|---|
| POST | `/auth/register` | Público | 201 `{ message, userId }` |
| POST | `/auth/login` | Público | 200 `{ accessToken, refreshToken, expiresIn }` |
| POST | `/auth/refresh` | Público | 200 `{ accessToken, refreshToken, expiresIn }` |
| POST | `/auth/logout` | Público | 204 |
| POST | `/roles` | Admin | 201 `{ message, roleId }` |
| GET | `/roles` | Admin | 200 `[{ id, role_name, description }]` |
| PATCH | `/users/:id/roles` | Admin | 200 `{ message: "Roles asignados" }` |
| GET | `/users/me` | Autenticado | 200 `{ id, email, name, phone, roles }` |
| GET | `/users` | Admin | 200 `[{ id, email, name, roles }]` |

### Errores

| Código | Cuándo |
|---|---|
| 400 | Datos inválidos: email mal escrito, campo requerido que falta, campo que no existe en el body, rol inexistente |
| 401 | Sin token, token inválido o vencido, credenciales incorrectas, refresh token usado o revocado |
| 403 | Con token, pero sin el rol que exige la ruta |
| 404 | Usuario no encontrado |
| 409 | Email o `role_name` ya registrado |
| 423 | Login de un usuario desactivado (`is_active = false`) |

### Ejemplos de body

```jsonc
// POST /auth/register  (password: entre 12 y 64 caracteres; phone es opcional)
{ "email": "ana@parcial.com", "password": "una-clave-larga-123", "name": "Ana", "phone": "3001234567" }

// POST /auth/login
{ "email": "ana@parcial.com", "password": "una-clave-larga-123" }

// POST /auth/refresh  y  POST /auth/logout
{ "refreshToken": "<refreshToken>" }

// POST /roles
{ "role_name": "supervisor", "description": "Supervisa usuarios" }

// PATCH /users/:id/roles  (reemplaza los roles del usuario)
{ "roles": ["admin", "supervisor"] }
```

## Autenticación

- Las contraseñas se guardan como hash scrypt (`PasswordHasher`) y nunca se devuelven en las respuestas.
- El access token dura 2 minutos. Cuando vence, el cliente usa `POST /auth/refresh` para obtener un par nuevo sin volver a escribir la contraseña.
- Cada refresh token sirve una sola vez (rotación). Si se reusa uno ya gastado, se revoca toda la sesión.
- Los refresh tokens se guardan en memoria (`allowInMemoryStorage: true`): al reiniciar la API hay que volver a hacer login.

## Autorización

Cada ruta declara su permiso con `@Can(Policy, 'regla')`, `@Can.Anyone()` (cualquier usuario autenticado) o `@Public()`. Una ruta sin ninguno de los tres responde 403.

Las reglas están en:

- `src/auth/policies/user.policy.ts`: rutas de `/users`
- `src/auth/policies/role.policy.ts`: rutas de `/roles`

El método `before()` de cada policy deja pasar al admin en todas las reglas. Para cambiar quién puede usar una ruta se cambia lo que devuelve su regla, por ejemplo:

```ts
list(user: User | null) {
  return tieneRol(user, 'supervisor'); // admin + supervisor
}
```

Los roles del usuario se cargan desde la base en cada petición, así que un cambio de roles aplica sin volver a hacer login.

## Estructura

```
src/
├── auth/
│   ├── auth.controller.ts      register, login, refresh, logout
│   ├── auth.dto.ts             validación de esos bodies
│   ├── jwt.auth.ts             lee el Bearer y carga el usuario con sus roles
│   └── policies/               reglas de autorización
├── users/                      entidad User, /users, /users/me, /users/:id/roles
├── roles/                      entidad Role, /roles
├── app.module.ts               conexión a la base, autenticación y autorización
└── main.ts                     ValidationPipe global
db/                             scripts SQL
docker-compose.yml              PostgreSQL
```

## Pruebas

```bash
npm test
```
