-- =====================================================================
-- init.sql: migración inicial (CREATE TABLE) para usuarios y roles
-- =====================================================================
-- Ejecutar con Docker arriba:
--   docker exec -i parcial_db psql -U parcial -d parcial_db < db/init.sql
--
-- Si usas esta migración, quita `synchronize: true` en app.module.ts
-- para que TypeORM no choque con las tablas ya creadas.
-- =====================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    email       varchar      NOT NULL UNIQUE,
    password    varchar      NOT NULL,
    name        varchar      NOT NULL,
    phone       varchar,
    is_active   boolean      NOT NULL DEFAULT true,
    created_at  timestamp    NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
    id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name   varchar      NOT NULL UNIQUE,
    description varchar,
    created_at  timestamp    NOT NULL DEFAULT now()
);

-- Tabla intermedia de la relación muchos a muchos (users <-> roles)
CREATE TABLE IF NOT EXISTS users_roles (
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_users_roles_role_id ON users_roles(role_id);

COMMIT;
