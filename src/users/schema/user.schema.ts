import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Role } from 'src/roles/entities/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  age: number;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'Role' })
  role: Role['title'];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
