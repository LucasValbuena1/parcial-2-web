import {
  ConflictException, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}

  // POST /roles -> 201 { message, roleId } · 409 si el role_name ya existe
  async create(dto: CreateRoleDto) {
    if (await this.roles.existsBy({ role_name: dto.role_name })) {
      throw new ConflictException('role_name ya existe');
    }
    const role = await this.roles.save(this.roles.create(dto));
    return { message: 'Rol creado con éxito', roleId: role.id };
  }

  // GET /roles -> 200 [{ id, role_name, description }] · 500 si falla la consulta
  async findAll() {
    try {
      return await this.roles.find({
        select: { id: true, role_name: true, description: true },
        order: { role_name: 'ASC' },
      });
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }

  // ---------- CRUD generado por el CLI (el enunciado no lo pide) ----------

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
