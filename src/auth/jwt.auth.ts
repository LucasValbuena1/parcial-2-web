import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from '@nestjs/authentication';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

// Lee el header "Authorization: Bearer <token>", verifica el token
// y carga el usuario (con sus roles) desde la base.
@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    private readonly users: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super(); // usa la misma configuración de accessToken del app.module
    registry.registerProvider(this, { order: 1 });
  }

  // Del token sale "sub" (el id del usuario). Si devuelve null -> 401.
  validate({ sub }: JwtClaims) {
    return sub ? this.users.findById(sub) : null;
  }
}
