import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { RolesService } from './roles.service.js';
import { RolePolicy } from '../auth/policies/role.policy.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

// Permisos: cada ruta usa una regla de RolePolicy
// (src/auth/policies/role.policy.ts). Para cambiar quién entra, cambia la
// regla allá; aquí solo si quieres @Can.Anyone() o @Public().
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Can(RolePolicy, 'create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Can(RolePolicy, 'list')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Can(RolePolicy, 'view')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Can(RolePolicy, 'update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Can(RolePolicy, 'remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
