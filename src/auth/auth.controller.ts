import {
  Body, Controller, HttpCode, HttpException, HttpStatus, Post, UnauthorizedException,
} from '@nestjs/common';
import { Public, TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RefreshDto, RegisterDto } from './auth.dto.js';

// @Public() en la clase: ninguna de estas rutas pide token
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly tokens: TokenService,
  ) {}

  // 201 { message, userId } · 400 email inválido · 409 email ya registrado
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.users.register(dto);
    return { message: 'Usuario registrado con éxito', userId: user.id };
  }

  // 200 { accessToken, refreshToken, expiresIn } · 401 credenciales · 423 desactivado
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.verifyCredentials(dto.email, dto.password);
    // Un solo mensaje para correo inexistente y contraseña mala
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (!user.is_active) throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);
    return this.tokens.issue(user.id, { method: 'password' });
  }

  // Cambia el refresh token por un par nuevo; el usado deja de servir (rotación)
  @HttpCode(200)
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.tokens.refresh(dto.refreshToken);
  }

  // Revoca el refresh token de esa sesión
  @HttpCode(204)
  @Post('logout')
  async logout(@Body() dto: RefreshDto) {
    await this.tokens.revoke(dto.refreshToken);
  }
}
