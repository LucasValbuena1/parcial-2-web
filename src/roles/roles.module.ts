import { Module } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { RolesController } from './roles.controller.js';
import { RolePolicy } from '../auth/policies/role.policy.js';

@Module({
  controllers: [RolesController],
  providers: [RolesService, RolePolicy], // la policy se registra como provider
})
export class RolesModule {}
