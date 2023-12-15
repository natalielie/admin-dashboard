import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from '../services/roles.service';
import { UpdateRoleDto } from 'src/Roles/dto/update-Role.dto';
import { CreateRoleDto } from '../dto/create-Role.dto';
//import { User } from 'src/users/schema/user.schema';
//import { ApiGuard } from 'src/decorators/api.guard.decorator';
//import { CurrentUser } from 'src/decorators/current-user.decorator';

//@ApiGuard()
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create/role')
  async create(
    @Body() createRoleDto: CreateRoleDto,
    //@CurrentUser() authUser: User,
  ) {
    this.roleService.create(createRoleDto);
  }

  @Get('all')
  public getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get('details/:id')
  public getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @Get()
  findByTitle(@Body() title: string) {
    return this.roleService.findByTitle(title);
  }

  @Patch('update/role/:id')
  public updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    // @CurrentUser() authUser: User,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete('delete-role/:id')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
