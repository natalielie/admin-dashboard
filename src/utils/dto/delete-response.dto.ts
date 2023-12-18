import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiResponseProperty()
  isDeleted: boolean;

  @ApiResponseProperty()
  message: string;
}
