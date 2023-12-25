import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  author: string | ObjectId;
}
