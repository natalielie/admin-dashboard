import { Module, forwardRef } from '@nestjs/common';
import { Role, RoleSchema } from './schema/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './services/roles.service';
import { RoleController } from './controllers/roles.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RoleService, JwtService],
  controllers: [RoleController],
  exports: [RoleService, JwtService],
})
export class RolesModule {}
