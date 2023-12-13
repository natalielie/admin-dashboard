import { IsEmail } from 'class-validator';
import { Role } from 'src/roles/entities/role.enum';

export class CreateUserDto {
  first_name: string;

  last_name: string;

  age: number;

  role: Role['title'];

  @IsEmail()
  email: string;

  password: string;

  refreshToken: string;
}
