import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

// PATCH /users/:id/roles  ->  body: { "roles": ["admin", "supervisor"] }
// Los valores son los role_name de la tabla roles.
export class AssignRolesDto {
  @IsArray({ message: 'roles inválidos' })
  @ArrayNotEmpty({ message: 'roles inválidos' })
  @IsString({ each: true, message: 'roles inválidos' })
  roles!: string[];
}
