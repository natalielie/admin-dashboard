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
import { RoleService } from '../services/roles.service';
import { UpdateRoleDto } from 'src/Roles/dto/update-Role.dto';
import { CreateRoleDto } from '../dto/create-Role.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @UseGuards(RoleGuard)
  @Post('create/role')
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

  @UseGuards(RoleGuard)
  @Delete('delete-role/:id')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}
