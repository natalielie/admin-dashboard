import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schema/user.schema';
import { Tokens } from '../interfaces/auth.interface';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto): Promise<Tokens> {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('signin')
  async signin(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const tokens = await this.authService.signIn(data);
    res
      .cookie('user_tokens', tokens, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .send({ status: 'ok' });
    return tokens;
  }

  @Patch('reset-token/:id')
  resetToken(
    @Param('id') userId: string,
    @Body() { refreshToken },
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Patch('reset-password/:id')
  resetPassword(
    @Param('id') userId: string,
    @Body() { currentPassword, newPassword },
  ): Promise<UserDocument> {
    return this.authService.resetPassword(userId, currentPassword, newPassword);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req);
  }
}
