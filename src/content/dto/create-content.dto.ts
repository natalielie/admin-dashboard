import { ObjectId } from 'mongoose';

export class CreateContentDto {
  source: Express.Multer.File;

  parent: string | ObjectId;
}
