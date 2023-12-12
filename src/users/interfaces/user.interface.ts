import { Document } from 'mongoose';

export interface User extends Document {
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  password: string;
}
