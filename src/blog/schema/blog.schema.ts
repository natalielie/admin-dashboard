import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Content } from 'src/content/schema/content.schema';
import { Post } from 'src/posts/schema/post.schema';
import { User } from 'src/users/schema/user.schema';

export type BlogDocument = Blog & Document;

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
