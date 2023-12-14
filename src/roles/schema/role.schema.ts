import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop()
  title: string;

  // @Prop({ default: true })
  // isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
