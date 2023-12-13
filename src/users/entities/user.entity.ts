import { Role } from 'src/roles/entities/role.enum';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  role: Role;
  email: string;
  password: string;
}
