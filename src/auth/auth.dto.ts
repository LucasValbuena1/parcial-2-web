import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

// POST /auth/register
// No tiene "roles": el registro no asigna roles (los asigna un admin).
// Si llega un campo que no está aquí, el ValidationPipe responde 400.
export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  // La longitud protege más que exigir símbolos raros
  @IsString()
  @Length(12, 64)
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

// POST /auth/login
export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

// POST /auth/refresh y POST /auth/logout
export class RefreshDto {
  @IsString({ message: 'refreshToken es requerido' })
  @IsNotEmpty({ message: 'refreshToken es requerido' })
  refreshToken!: string;
}
