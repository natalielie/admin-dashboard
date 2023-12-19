import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleService } from 'src/roles/services/roles.service';
import { extractJWT } from '../strategies/extract-jwt.function';
import { UsersService } from 'src/users/services/users.service';
import { compareHash } from 'src/utils/hash.functions';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RoleService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokens = extractJWT(request);
    const users = await this.userService.getAll();
    const currentUser = users.find((user) =>
      compareHash(tokens.refreshToken, user.refreshToken),
    );
    const roles = await this.roleService.getAllRoles();
    const currentRole = roles.find(
      (role) => role._id.toString() === currentUser.roleId.toString(),
    );
    if (currentRole.title === 'Admin') {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
