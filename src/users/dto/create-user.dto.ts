import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';
import { Role } from 'src/roles/interfaces/role.interface';

export class CreateUserDto {
  first_name: string;

  last_name: string;

  @IsNumberString()
  age: number;

  role: Role;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  refreshToken: string;
}
