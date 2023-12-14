import { User } from 'src/users/interfaces/user.interface';

export interface Payload {
  user: User;
  token: string;
}
