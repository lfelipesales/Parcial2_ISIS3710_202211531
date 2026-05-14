import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  role_name: string | undefined;

  @IsOptional()
  @IsString()
  description?: string;
}
