import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity.js';
import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';
import { RolePolicy } from '../auth/policies/role.policy.js';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // para usar el repositorio de Role en el service
  controllers: [RolesController],
  providers: [RolesService, RolePolicy], // la policy se registra como provider
})
export class RolesModule {}
