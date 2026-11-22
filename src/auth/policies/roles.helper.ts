import { User } from '../../users/entities/user.entity.js';

// =====================================================================
// AYUDANTES PARA LAS POLICIES: ¿el usuario tiene tal rol?
// =====================================================================
// user.roles viene cargado desde la base en CADA petición (lo hace JwtAuth
// con findById).
//
// Los nombres ('admin', 'supervisor', 'user') son los de la columna
// role_name de la tabla roles. Si creas un rol nuevo (ej. 'auditor'),
// úsalo aquí con el mismo nombre exacto.
// =====================================================================

/** true si el usuario tiene AL MENOS UNO de los roles indicados. */
export function tieneRol(user: User | null, ...roles: string[]): boolean {
  // user es null cuando no hay usuario: en ese caso nunca tiene roles
  return !!user?.roles?.some((rol) => roles.includes(rol.role_name));
}

/** true si el usuario es admin. Lo usan los before() de las policies. */
export function esAdmin(user: User | null): boolean {
  return tieneRol(user, 'admin');
}
