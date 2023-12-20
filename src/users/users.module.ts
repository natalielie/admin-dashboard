import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, JwtService],
  exports: [UsersService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
