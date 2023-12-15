import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteResponseDTO {
  @ApiResponseProperty()
  isDeleted: boolean;

  @ApiResponseProperty()
  message: string;
}
