import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { CreateUserDto } from 'src/users/dto/createUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(
    @Body() data: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(data);
  }

  @Patch('reset-token/:id')
  resetToken(
    @Param('id') userId: string,
    @Body() { refreshToken },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Patch('reset-password/:id')
  resetPassword(
    @Param('id') userId: string,
    @Body() { currentPassword, newPassword },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.resetPassword(userId, currentPassword, newPassword);
  }

  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }
}
