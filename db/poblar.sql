-- =====================================================================
-- poblar.sql: datos de prueba (usuarios, roles y sus asignaciones)
-- =====================================================================
-- Requiere haber corrido db/init.sql (o tener las tablas creadas).
--   docker exec -i parcial_db psql -U parcial -d parcial_db < db/poblar.sql
--
-- Contraseñas de los usuarios de prueba (para POST /auth/login):
--   admin@parcial.com       Admin-Parcial-2026       rol: admin
--   supervisor@parcial.com  Supervisor-Parcial-2026  roles: supervisor, user
--   user@parcial.com        Usuario-Parcial-2026     rol: user
--   inactivo@parcial.com    Inactivo-Parcial-2026    sin roles, is_active = false (login -> 423)
--
-- En la columna password va el hash scrypt de cada contraseña, generado con
-- el PasswordHasher de @nestjs/authentication (el mismo que usa el registro).
-- =====================================================================

BEGIN;

INSERT INTO roles (id, role_name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin',      'Administrador del sistema'),
  ('22222222-2222-2222-2222-222222222222', 'supervisor', 'Supervisa y consulta usuarios'),
  ('33333333-3333-3333-3333-333333333333', 'user',       NULL);

INSERT INTO users (id, email, password, name, phone, is_active) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin@parcial.com',      '$scrypt$ln=17,r=8,p=1$EZh+0eux2CjBcGm0wNSkhA$W+UqHzNGTdNHvgCCZBwIWdHYLeSbFQbN7+i5jxuJLPI', 'Admin',            '3001112233', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'supervisor@parcial.com', '$scrypt$ln=17,r=8,p=1$DdjIJ+iRQpMB8A5pCJImbg$vL3J02Gw3uftBdVf0En+wX0eu7gAaMt1bTVKBTlGQ5Y', 'Sara Supervisora', NULL,         true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'user@parcial.com',       '$scrypt$ln=17,r=8,p=1$FygqKCTvjTHdcCBqknePJQ$ejldYE4bDKMmC87WSWSnYbMZ1gfmgB3toUCVg3+2/Co', 'Ulises Usuario',    '3004445566', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'inactivo@parcial.com',   '$scrypt$ln=17,r=8,p=1$ZxgGMuQaxel9NUFfK5uUsw$WclBn/f6dmJGu+1kxLnyZVYG1Wwuv3gbbROglQGzk7o', 'Ines Inactiva',     NULL,         false);

INSERT INTO users_roles (user_id, role_id) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'), -- admin -> admin
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'), -- supervisor -> supervisor
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'), -- supervisor tambien user
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'); -- user -> user
-- inactivo@parcial.com queda sin roles (sirve para probar el 423 Locked)

COMMIT;
