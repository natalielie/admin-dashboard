import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsNotEmpty()
  @MinLength(1)
  shortForm: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiResponseProperty()
  createdBy: string;
}
