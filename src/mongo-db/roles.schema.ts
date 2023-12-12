import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Roles {
  @Prop()
  title: string;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
