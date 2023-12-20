import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  _id: ObjectId;

  @Prop({ required: true, unique: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  shortForm: string;

  @Prop()
  createdBy: string;

  @Prop()
  updatedBy: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
