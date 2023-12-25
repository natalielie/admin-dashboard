import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from 'src/posts/schema/post.schema';
import { User } from 'src/users/schema/user.schema';

export type ContentDocument = Content & Document;

@Schema()
export class Content {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' })
  parent: Post | User;

  @Prop()
  awsKey: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
