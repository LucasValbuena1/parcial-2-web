-- =====================================================================
-- poblar.sql: datos de prueba (usuarios, roles y sus asignaciones)
-- =====================================================================
-- Requiere haber corrido db/init.sql (o tener las tablas creadas).
--   docker exec -i parcial_db psql -U parcial -d parcial_db < db/poblar.sql
--
-- OJO: el campo password debe ser el hash scrypt generado con el
-- PasswordHasher del paquete. Los valores de abajo son PLACEHOLDERS:
-- reemplázalos por hashes reales para poder hacer login con estos usuarios.
-- =====================================================================

BEGIN;

INSERT INTO roles (id, role_name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin',      'Administrador del sistema'),
  ('22222222-2222-2222-2222-222222222222', 'supervisor', 'Supervisa y consulta usuarios'),
  ('33333333-3333-3333-3333-333333333333', 'user',       NULL);

INSERT INTO users (id, email, password, name, phone, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@parcial.com',      'HASH_PLACEHOLDER', 'Admin',            '3001112233', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'supervisor@parcial.com', 'HASH_PLACEHOLDER', 'Sara Supervisora', NULL,         true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user@parcial.com',       'HASH_PLACEHOLDER', 'Ulises Usuario',    '3004445566', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'inactivo@parcial.com',   'HASH_PLACEHOLDER', 'Ines Inactiva',     NULL,         false);

INSERT INTO users_roles (user_id, role_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'), -- admin -> admin
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'), -- supervisor -> supervisor
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'), -- supervisor tambien user
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'); -- user -> user
-- inactivo@parcial.com queda sin roles (sirve para probar el 423 Locked)

COMMIT;
