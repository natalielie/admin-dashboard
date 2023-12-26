import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { sanitize } from 'src/utils/sanitize.function';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { ApiBody } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiBody({ type: [CreateUserDto] })
  @Post('create/user')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return sanitize(user, ['password', 'refreshToken']);
  }

  @Get()
  async getAll() {
    const users = await this.usersService.getAll();
    users.forEach((user) => {
      sanitize(user, ['password', 'refreshToken']);
    });
    return users;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const user = await this.usersService.getById(id);
    return sanitize(user, ['password', 'refreshToken']);
  }
  async updateUser(
    @Res() response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const existingUser = await this.usersService.update(id, updateUserDto);
      return response.status(HttpStatus.OK).json({
        message: 'User has been successfully updated',
        existingUser,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
