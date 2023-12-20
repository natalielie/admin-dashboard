import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'src/posts/schema/post.schema';
import { User } from 'src/users/schema/user.schema';

export type ContentDocument = Content & Document;

@Schema()
export class Content {
  @Prop()
  source: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' })
  parent: Post | User;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
