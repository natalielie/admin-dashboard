import { User } from 'src/users/entities/user.entity';

export interface Payload {
  user: User;
  token: string;
}
