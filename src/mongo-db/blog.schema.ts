import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../users/schema/user.schema';
import { Post } from 'src/posts/schema/post.schema';
import { Content } from 'src/content/schema/content.schema';

@Schema()
export class Blog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
  posts: Post[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  users: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Content' })
  content: Content[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
