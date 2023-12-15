import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-Role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Role, RoleDocument } from '../schema/role.schema';
import { UpdateRoleDto } from '../dto/update-Role.dto';
//import { User } from 'src/users/schema/user.schema';
import { ResponseHelper } from 'src/utils/response';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    //private usersService: UsersService,
  ) {}

  /** create */

  async create(createRoleDTO: CreateRoleDto) {
    await this.canAddRole(createRoleDTO);
    //createRoleDTO.createdBy = String(authUser?._id);
    const newRole = new this.roleModel(createRoleDTO);
    return await newRole.save();
  }

  /** find */

  async findByTitle(title: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ title }).exec();
  }

  // async findByUserId(id: string): Promise<RoleDocument> {
  //   return this.roleModel.findById({ user: id });
  // }

  async getRoleById(id: string | Schema.Types.ObjectId): Promise<RoleDocument> {
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException(`Role does not exist.`);
    }

    return role;
  }

  async getAllRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find();
  }

  /** delete */

  async deleteRole(title: string) {
    const filter = { title: title };

    const deleted = await this.roleModel.deleteOne(filter);
    return deleted;
  }

  // async deleteRole(id: string | Schema.Types.ObjectId) {
  //   await this.getRoleById(id);

  //   const deletedRole = await this.roleModel.findByIdAndDelete(id);

  //   return ResponseHelper.deleteResponse(deletedRole ? true : false);
  // }

  /** update */

  public async updateRole(
    id: string | Schema.Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
    //authUser: User,
  ) {
    await this.getRoleById(id);

    // updateRoleDto.updatedBy = authUser?._id.toString();
    const updatedRole = await this.roleModel.findByIdAndUpdate(
      id,
      updateRoleDto,
    );

    return ResponseHelper.updateResponse(updatedRole ? true : false, id);
  }

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

  private async canAddRole(createRoleDTO: CreateRoleDto) {
    const role = await this.findByTitle(createRoleDTO.title);
    if (role) {
      throw new BadRequestException(`Role ${role.title} already exists.`);
    }
    return true;
  }
}
