import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateUserDto {
  first_name: string;

  last_name: string;

  @IsNumberString()
  age: number;

  roleId: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  refreshToken: string;
}
