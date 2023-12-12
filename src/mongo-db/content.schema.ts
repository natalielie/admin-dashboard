import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './posts.schema';
import { User } from './user.schema';

@Schema()
export class Content {
  @Prop()
  source: string;

  @Prop()
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' })
  post: Post | User;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
