import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// POST /roles  ->  body: { "role_name": "auditor", "description": "Revisa..." }
export class CreateRoleDto {
  @IsString({ message: 'role_name es requerido' })
  @IsNotEmpty({ message: 'role_name es requerido' })
  role_name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
