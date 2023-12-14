import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { RoleService } from '../services/roles.service';
import { UpdateRoleDto } from 'src/Roles/dto/update-Role.dto';
import { CreateRoleDto } from '../dto/create-Role.dto';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create/role')
  async create(@Body() createRoleDto: CreateRoleDto) {
    this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get()
  findByTitle(@Body() title: string) {
    return this.roleService.findByTitle(title);
  }

  //   @Get(':id')
  //   findByUserId(@Param('id') userId: string) {
  //     return this.rolesService.findByUserId(userId);
  //   }

  //   @Patch('update/role/:id')
  //   async update(
  //     @Res() response,
  //     @Param('id') id: string,
  //     @Body() updateRoleDto: UpdateRoleDto,
  //   ) {
  //     try {
  //       const existingRole = await this.roleService.update(id, updateRoleDto);
  //       return response.status(HttpStatus.OK).json({
  //         message: 'Role has been successfully updated',
  //         existingRole,
  //       });
  //     } catch (err) {
  //       return response.status(err.status).json(err.response);
  //     }
  //   }

  @Delete('delete-role/:id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
