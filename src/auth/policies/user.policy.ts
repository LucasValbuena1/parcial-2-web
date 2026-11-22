import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { User } from '../../users/entities/user.entity.js';
// tieneRol: úsalo dentro de las reglas para darle acceso a otros roles
import { esAdmin, tieneRol } from './roles.helper.js';

// =====================================================================
// UserPolicy: QUIÉN PUEDE HACER QUÉ CON LOS USUARIOS
// =====================================================================
// Cada método de abajo es una REGLA (ability). Se conecta con una ruta
// en users.controller.ts así:
//
//     @Can(UserPolicy, 'list')        <- nombre del método de esta clase
//     @Get()
//     findAll() { ... }
//
// Si la regla devuelve true -> pasa. Si devuelve false -> 403 Forbidden.
// Sin token -> 401 (eso lo responde el paquete, no esta clase).
//
// ---------------------------------------------------------------------
// CÓMO CAMBIAR PERMISOS (lo más probable en el parcial):
// ---------------------------------------------------------------------
// 1) Dar acceso a otro rol además del admin:
//        return false;                          // solo admin
//    cámbialo por:
//        return tieneRol(user, 'supervisor');   // admin + supervisor
//        return tieneRol(user, 'supervisor', 'user'); // admin + supervisor + user
//
// 2) Que cualquier usuario CON TOKEN pueda entrar:
//        return user !== null;
//    (o en el controlador cambia @Can(...) por @Can.Anyone())
//
// 3) Que la ruta sea PÚBLICA (sin token): en el controlador quita el
//    @Can(...) y pon @Public() (import de '@nestjs/authentication').
//
// 4) Que cada quien solo pueda tocar SU PROPIO usuario: mira la regla
//    'update' de abajo (compara user.id con el :id de la URL).
//
// 5) Quitarle al admin el pase libre en una regla concreta: mira el
//    comentario dentro de before().
//
// 6) Crear una regla NUEVA: agrega un método aquí (su primer parámetro
//    tiene que ser `user: User | null` y devolver boolean) y úsalo en la
//    ruta con @Can(UserPolicy, 'nombreDelMetodo').
//
// IMPORTANTE: toda ruta necesita @Can(), @Can.Anyone() o @Public().
// Si una ruta no tiene ninguno de los tres, responde 403 SIEMPRE
// (cerrado por defecto).
// =====================================================================
@Policy()
export class UserPolicy implements PolicyBefore<User> {
  // Corre ANTES de cualquier regla de esta clase.
  //   - devuelve true      -> pasa sin mirar la regla (el admin pasa todo)
  //   - devuelve undefined -> se evalúa la regla normal (todos los demás)
  // Para que el admin NO pase libre en una regla concreta, por ejemplo
  // 'remove', usa el segundo parámetro:
  //     before(user: User | null, ability: string) {
  //       if (ability === 'remove') return undefined; // se evalúa la regla
  //       if (esAdmin(user)) return true;
  //     }
  before(user: User | null) {
    if (esAdmin(user)) return true;
    return undefined;
  }

  // GET /users -> listar usuarios. Enunciado: solo admin.
  list(_user: User | null) {
    return false; // solo admin (pasa por before). Ej: return tieneRol(_user, 'supervisor');
  }

  // GET /users/:id -> ver un usuario por id
  view(_user: User | null) {
    return false; // solo admin
  }

  // POST /users -> crear usuario desde el CRUD (el registro normal es /auth/register)
  create(_user: User | null) {
    return false; // solo admin
  }

  // PATCH /users/:id -> editar un usuario.
  // EJEMPLO DE REGLA "DUEÑO": cada usuario puede editarse a sí mismo.
  // El id llega desde la ruta con el tercer argumento de @Can (ver controlador).
  update(user: User | null, id: string) {
    return user !== null && user.id === id; // admin pasa por before; los demás solo su propio id
  }

  // DELETE /users/:id -> borrar usuario
  remove(_user: User | null) {
    return false; // solo admin
  }

  // PATCH /users/:id/roles -> asignar roles. Enunciado: solo admin.
  assignRoles(_user: User | null) {
    return false; // solo admin
  }
}
