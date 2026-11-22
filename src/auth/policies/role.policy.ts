import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { User } from '../../users/entities/user.entity.js';
// tieneRol: úsalo dentro de las reglas para darle acceso a otros roles
import { esAdmin, tieneRol } from './roles.helper.js';

// =====================================================================
// RolePolicy: QUIÉN PUEDE HACER QUÉ CON LOS ROLES
// =====================================================================
// Funciona igual que UserPolicy (lee la guía completa en user.policy.ts).
// Se conecta en roles.controller.ts con @Can(RolePolicy, 'nombreDeRegla').
//
// Resumen rápido para cambiar permisos:
//   return false;                          -> solo admin
//   return tieneRol(user, 'supervisor');   -> admin + supervisor
//   return user !== null;                  -> cualquiera con token
//   @Public() en la ruta (sin @Can)        -> sin token
// =====================================================================
@Policy()
export class RolePolicy implements PolicyBefore<User> {
  // El admin pasa todas las reglas de esta clase
  before(user: User | null) {
    if (esAdmin(user)) return true;
    return undefined;
  }

  // POST /roles -> crear rol. Enunciado: solo admin.
  create(_user: User | null) {
    return false;
  }

  // GET /roles -> listar roles. Enunciado: solo admin.
  // Ejemplo si piden que el supervisor también pueda listarlos:
  //   list(user: User | null) { return tieneRol(user, 'supervisor'); }
  list(_user: User | null) {
    return false;
  }

  // GET /roles/:id -> ver un rol
  view(_user: User | null) {
    return false;
  }

  // PATCH /roles/:id -> editar un rol
  update(_user: User | null) {
    return false;
  }

  // DELETE /roles/:id -> borrar un rol
  remove(_user: User | null) {
    return false;
  }
}
