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
import { ResponseHelper } from 'src/utils/response';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  /** create */

  async create(createRoleDTO: CreateRoleDto) {
    await this.canAddRole(createRoleDTO);
    const newRole = new this.roleModel(createRoleDTO);
    return await newRole.save();
  }

  /** get */

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

  /** update */

  public async updateRole(
    id: string | Schema.Types.ObjectId,
    updateRoleDto: UpdateRoleDto,
  ) {
    await this.getRoleById(id);

    const updatedRole = await this.roleModel.findByIdAndUpdate(
      id,
      updateRoleDto,
    );

    return ResponseHelper.updateResponse(updatedRole ? true : false, id);
  }

  private async canAddRole(createRoleDTO: CreateRoleDto) {
    const role = await this.findByTitle(createRoleDTO.title);
    if (role) {
      throw new BadRequestException(`Role ${role.title} already exists.`);
    }
    return true;
  }

  private async findByTitle(title: string): Promise<RoleDocument> {
    return this.roleModel.findOne({ title: title });
  }
}
