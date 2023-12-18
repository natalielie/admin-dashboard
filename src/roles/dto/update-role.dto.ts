import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-Role.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiResponseProperty()
  updatedBy: string;
}
