import { ApiResponseProperty } from '@nestjs/swagger';

export class RoleResponseDTO {
  @ApiResponseProperty()
  _id: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  shortForm: string;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  createdBy: string;

  @ApiResponseProperty()
  updatedBy: string;
}
