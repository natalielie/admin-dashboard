import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { sign } from 'jsonwebtoken';
import { Payload } from 'src/shared/payload';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signPayload(payload: Payload) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }
  async validateUser(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }

  //async resetPassword(currentPassword, newPassword, submitPassword) {}

  //async resetToken() {}
}
