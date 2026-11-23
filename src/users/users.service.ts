import {
  BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PasswordHasher } from '@nestjs/authentication';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { RegisterDto } from '../auth/auth.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    private readonly hasher: PasswordHasher, // viene con el AuthenticationModule
  ) {}

  // ---------- Autenticación ----------

  async register(dto: RegisterDto) {
    if (await this.users.existsBy({ email: dto.email })) {
      throw new ConflictException('Email ya registrado');
    }
    const password = await this.hasher.hash(dto.password); // scrypt, nunca texto plano
    return this.users.save(this.users.create({ ...dto, password }));
  }

  /** El usuario si el correo y la contraseña coinciden; si no, null. */
  async verifyCredentials(email: string, password: string) {
    // password tiene select: false en la entidad: aquí sí se pide
    const user = await this.users
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    // Si el correo no existe, compara contra un hash falso: tarda lo mismo
    const valid = await this.hasher.verify(password, user?.password);
    return user && valid ? user : null;
  }

  /** Lo usa JwtAuth en cada petición: el usuario con sus roles, sin password. */
  findById(id: string) {
    return this.users.findOne({ where: { id }, relations: { roles: true } });
  }

  // ---------- Roles del usuario ----------

  /** PATCH /users/:id/roles: reemplaza los roles del usuario por los de la lista. */
  async assignRoles(id: string, roleNames: string[]) {
    const user = await this.users.findOne({ where: { id }, relations: { roles: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const nombres = [...new Set(roleNames)]; // quita repetidos
    const roles = await this.roles.findBy({ role_name: In(nombres) });
    // Si algún nombre no existe en la tabla roles -> 400
    if (roles.length !== nombres.length) throw new BadRequestException('roles inválidos');

    user.roles = roles;
    await this.users.save(user); // TypeORM actualiza la tabla users_roles
    return { message: 'Roles asignados' };
  }

  // ---------- CRUD generado por el CLI ----------

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  // GET /users -> 200 [{ id, email, name, roles }] · 500 si falla la consulta
  // roles sale como lista de nombres: ["admin", "user"]
  async findAll() {
    try {
      const users = await this.users.find({ relations: { roles: true }, order: { email: 'ASC' } });
      return users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((rol) => rol.role_name),
      }));
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
