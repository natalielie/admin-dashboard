import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { extractJWT } from '../strategies/extract-jwt.function';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  matchRoles(roles: string[], userRole: string): boolean {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = extractJWT(request);

    const decodedJwtToken: JwtPayload = this.jwtService.decode(
      tokens.refreshToken,
    );

    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return false;
    }

    if (this.matchRoles(roles, decodedJwtToken.role)) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
