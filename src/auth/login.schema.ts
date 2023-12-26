import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type LoginDocument = Login & Document;

@Schema()
export class Login {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
