import { Schema } from 'mongoose';
import { DeleteResponseDTO } from './dto/delete-response.dto';
import { UpdateResponseDTO } from './dto/update-response.dto';

export class ResponseHelper {
  public static updateResponse(
    isUpdated: boolean,
    id?: string | Schema.Types.ObjectId,
    message?: string,
  ) {
    const response = new UpdateResponseDTO(id ? String(id) : null);
    response.isUpdated = isUpdated;
    response.message = isUpdated
      ? message || 'Successfully updated.'
      : message || 'Update failed.';

    return response;
  }

  public static deleteResponse(isDeleted: boolean, message?: string) {
    const response = new DeleteResponseDTO();

    response.isDeleted = isDeleted;
    response.message = isDeleted
      ? message || 'Successfully deleted.'
      : message || 'Delete failed.';

    return response;
  }
}
