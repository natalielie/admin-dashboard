import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Res,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from '../dto/login-dto';
import { jwtConstants } from '../constants';
import { UserDocument } from 'src/users/schema/user.schema';
import { Payload, Tokens } from '../interfaces/auth.interface';
import { compareHash, hashData } from 'src/utils/hash.functions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(payload: Payload): Promise<UserDocument | undefined> {
    return await this.userService.getByEmail(payload.user.email);
  }

  async signUp(createUserDto: CreateUserDto): Promise<Tokens> {
    const userExists = await this.userService.getByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = await this.userService.create(createUserDto);

    const tokens = await this.getTokens(
      createdUser._id.toString(),
      createdUser.email,
      createdUser.roleId,
    );
    await this.updateRefreshToken(
      createdUser._id.toString(),
      tokens.refreshToken,
    );
    return tokens;
  }

  async signIn(data: LoginDto): Promise<Tokens> {
    const user = await this.userService.getByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = await compareHash(data.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.roleId,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async logout(@Res({ passthrough: true }) res): Promise<UserDocument> {
    res.cookie('token', '', { expires: new Date() });
    return this.userService.update(res['sub'], {
      refreshToken: null,
      accessToken: null,
    });
  }

  async resetPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const user = await this.userService.getById(userId);
    const passwordMatches = await compareHash(currentPassword, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    } else {
      const hash = await hashData(newPassword);
      const updatedUser = await this.userService.update(user._id.toString(), {
        password: hash,
      });

      const tokens = await this.getTokens(
        updatedUser._id.toString(),
        updatedUser.email,
        updatedUser.roleId,
      );
      await this.updateRefreshToken(
        updatedUser._id.toString(),
        tokens.refreshToken,
      );
      return updatedUser;
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.getById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await compareHash(
      refreshToken.toString(),
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(
      user._id.toString(),
      user.email,
      user.roleId,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await hashData(refreshToken);
    await this.userService.update(userId, { refreshToken: hashedRefreshToken });
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '60m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: jwtConstants.secret,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
