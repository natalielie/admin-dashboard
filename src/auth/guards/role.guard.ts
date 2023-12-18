import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleService } from 'src/roles/services/roles.service';
import { extractJWT } from '../strategies/extract-jwt.function';
import { AuthService } from '../services/auth.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = extractJWT(request);
    const currentUser = (await this.userService.getAll()).find((user) =>
      this.authService.compareHash(tokens.refreshToken, user.refreshToken),
    );
    const currentRole = (await this.roleService.getAllRoles()).find(
      (role) => role._id.toString() === currentUser.roleId,
    );
    if (currentRole.title === 'Administrator') {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
