import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateContentDto {
  @IsNotEmpty()
  source: string;

  @IsNotEmpty()
  parent: string | ObjectId;
}
