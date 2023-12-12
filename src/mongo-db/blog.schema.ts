import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './posts.schema';
import { User } from './user.schema';

@Schema()
export class Blog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  posts: Post[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  users: User[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
