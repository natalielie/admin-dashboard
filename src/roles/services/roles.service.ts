import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Role, RoleDocument } from '../schema/role.schema';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { ResponseHelper } from 'src/utils/response';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  /** create */

  async create(createRoleDTO: CreateRoleDto): Promise<RoleDocument> {
    await this.canAddRole(createRoleDTO);
    const newRole = new this.roleModel(createRoleDTO);
    return await newRole.save();
  }

  /** get */

  async findByTitle(title: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ title: title });
  }

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

  async deleteRole(id: string): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const deletedRole = await this.roleModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedRole ? true : false);
  }

  /** update */

  public async updateRole(
    id: string | Schema.Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateResponseDto> {
    await this.getRoleById(id);

    const updatedRole = await this.roleModel.findByIdAndUpdate(
      id,
      updateRoleDto,
    );

    return ResponseHelper.updateResponse(updatedRole ? true : false, id);
  }

  private async canAddRole(createRoleDTO: CreateRoleDto): Promise<boolean> {
    const role = await this.findByTitle(createRoleDTO.title);
    if (role) {
      throw new BadRequestException(`Role ${role.title} already exists.`);
    }
    return true;
  }
}
