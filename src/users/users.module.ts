import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { UserPolicy } from '../auth/policies/user.policy.js';

@Module({
  // Role también: User tiene la relación roles, y TypeORM necesita las dos entidades
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UserPolicy], // la policy se registra como provider
  exports: [UsersService], // lo usa el AuthModule (login, registro y JwtAuth)
})
export class UsersModule {}
