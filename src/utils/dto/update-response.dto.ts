import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateResponseDTO {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  isUpdated: boolean;

  @ApiResponseProperty()
  message: string;

  constructor(id?: string) {
    if (id) {
      this.id = id;
    }
  }
}
