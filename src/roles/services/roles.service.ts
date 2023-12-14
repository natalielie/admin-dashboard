import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-Role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schema/role.schema';
import { UpdateRoleDto } from '../dto/update-Role.dto';
import { UsersService } from 'src/users/services/users.service';
import { UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    //private usersService: UsersService,
  ) {}

  /** create */

  async create(createDTO: CreateRoleDto) {
    const { title } = createDTO;
    const role = await this.roleModel.findOne({ title });
    if (role) {
      throw new HttpException('role already exists', HttpStatus.BAD_REQUEST);
    }
    const createdRole = new this.roleModel(createDTO);

    return await createdRole.save();
  }

  /** find */

  async findByTitle(title: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ title }).exec();
  }

  async findByUserId(id: string): Promise<RoleDocument> {
    return this.roleModel.findById({ user: id });
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find();
  }

  /** delete */

  async remove(title: string) {
    const filter = { title: title };

    const deleted = await this.roleModel.deleteOne(filter);
    return deleted;
  }

  /** update */

  //   async update(
  //     userId: string,
  //     updateRoleDto: UpdateRoleDto,
  //   ): Promise<UserDocument> {
  //     const existingUser = await this.usersService.update(userId, {
  //       role: updateRoleDto.title,
  //     });
  //     if (!existingUser) {
  //       throw new NotFoundException(`User #${userId} not found`);
  //     }

  //     // const updatedRole = await this.roleModel.findOneAndUpdate(
  //     //   { title: userId },
  //     //   updateRoleDto,
  //     //   {
  //     //     new: true,
  //     //   },
  //     // );
  //     //return updatedRole;
  //     return existingUser;
  //   }
}
