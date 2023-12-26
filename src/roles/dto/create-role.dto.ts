import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  shortForm: string;

  @ApiProperty()
  createdBy: string;
}
