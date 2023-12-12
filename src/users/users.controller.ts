import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUserDto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  //   @Get()
  //   async findAll(): Promise<User[]> {
  //     return this.usersService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param() params: FindOneParams) {
  //     return 'This action returns a user';
  //   }
}
