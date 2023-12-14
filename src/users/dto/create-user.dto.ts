import { IsEmail, IsNumber, IsString } from 'class-validator';
import { Role } from 'src/roles/enum/role.enum';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsNumber()
  age: number;

  @IsString()
  role: Role['title'];

  @IsEmail()
  email: string;

  password: string;

  refreshToken: string;
}
