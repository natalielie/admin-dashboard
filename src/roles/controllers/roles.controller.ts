import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleService } from '../services/roles.service';

@Controller('roles')
@UseGuards(AuthGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create/role')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  async create(@Body() createRoleDto: CreateRoleDto) {
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

  @Patch('update/role/:id')
  public updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Delete('delete-role/:id')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
