# CMDS

## Paso 1 · Terminal 1: base limpia y app

```bash
docker compose down -v && docker compose up -d
npm run start:dev
```

Esperar a que salga `[Tablas] OK`. Dejar esta terminal abierta.

## Paso 2 · Terminal 2: cargar usuarios de prueba

```bash
docker exec -i parcial_db psql -U parcial -d parcial_db < db/poblar.sql
```

## Paso 3 · Terminal 2: sacar tokens (repetir si pasan 2 minutos)

```bash
ADMIN=$(curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@parcial.com","password":"Admin-Parcial-2026"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).accessToken')
NORMAL=$(curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' -d '{"email":"user@parcial.com","password":"Usuario-Parcial-2026"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).accessToken')
```

## Paso 4 · Terminal 2: probar (cambiar /users por la ruta)

Debe salir, en orden: `-> 401` (sin token), `-> 403` (normal), `-> 200` (admin).

```bash
curl -s -w "  -> %{http_code}\n" localhost:3000/users
curl -s -w "  -> %{http_code}\n" localhost:3000/users -H "Authorization: Bearer $NORMAL"
curl -s -w "  -> %{http_code}\n" localhost:3000/users -H "Authorization: Bearer $ADMIN"
```
