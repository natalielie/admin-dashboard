import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Role } from 'src/roles/enum/role.enum';

export class CreateUserDto {
  first_name: string;

  last_name: string;

  @IsNumberString()
  age: number;

  @IsString()
  role: Role['title'];

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  refreshToken: string;
}
