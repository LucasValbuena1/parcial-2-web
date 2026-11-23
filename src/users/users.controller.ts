import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { User } from './entities/user.entity.js';
import { UserPolicy } from '../auth/policies/user.policy.js';
import { AssignRolesDto } from './dto/assign-roles.dto.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

// ---------------------------------------------------------------------
// PERMISOS DE CADA RUTA
// ---------------------------------------------------------------------
// @Can(UserPolicy, 'regla')  -> decide la regla 'regla' de UserPolicy
//                               (src/auth/policies/user.policy.ts)
// @Can.Anyone()              -> cualquier usuario CON token
// @Public()                  -> sin token (import de '@nestjs/authentication')
//
// Para cambiar QUIÉN puede entrar a una ruta, normalmente NO se toca este
// archivo: se cambia lo que devuelve la regla en user.policy.ts.
// Aquí solo se cambia si quieres conectar la ruta a OTRA regla, o volverla
// @Can.Anyone() / @Public().
// ---------------------------------------------------------------------
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Can(UserPolicy, 'create')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Can(UserPolicy, 'list')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/me: el usuario del token (lo carga JwtAuth, con sus roles).
  // Va antes de ':id' para que "me" no se tome como un id.
  // @Can.Anyone(): cualquier usuario con token ve SU propio perfil
  @Can.Anyone()
  @Get('me')
  // Responde solo lo que pide el enunciado: { id, email, name, phone, roles }
  me(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles.map((rol) => rol.role_name),
    };
  }

  @Can(UserPolicy, 'view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Regla con argumento: el tercer parámetro de @Can le pasa a la regla
  // 'update' el :id de la URL, para comparar con el usuario del token.
  @Can(UserPolicy, 'update', (context) => [
    context.switchToHttp().getRequest().params.id as string,
  ])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // PATCH /users/:id/roles -> asignar roles a un usuario (solo admin)
  @Can(UserPolicy, 'assignRoles')
  @Patch(':id/roles')
  assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto) {
    return this.usersService.assignRoles(id, dto.roles);
  }

  @Can(UserPolicy, 'remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
