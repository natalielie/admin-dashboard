import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleService } from 'src/roles/services/roles.service';
import { extractJWT } from '../strategies/extract-jwt.function';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    private readonly roleService: RoleService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = extractJWT(request);
    const decodedJwtToken: JwtPayload = this.jwtService.decode(
      tokens.refreshToken,
    );
    const roles = await this.roleService.getAllRoles();
    const currentRole = roles.find(
      (role) => role._id.toString() === decodedJwtToken.role,
    );
    if (currentRole.title === 'Admin') {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
