import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { RoleService } from 'src/roles/services/roles.service';
import { sanitize } from 'src/utils/sanitise.function';
import { Payload } from 'src/auth/interfaces/auth.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RoleService,
  ) {}

  async create(createDTO: CreateUserDto) {
    const { email } = createDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(createDTO);

    await createdUser.save();

    return sanitize(createdUser, ['password', 'refreshToken']);
  }

  /** find */

  async findByLogin(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPayload(payload: Payload) {
    const { email } = payload.user;
    return await this.userModel.findOne({ email });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById({ _id: id });
  }

  async remove(id: string) {
    const filter = { _id: id };

    const deleted = await this.userModel.deleteOne(filter);
    return deleted;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const existingUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    // if (updateUserDto.role) {
    //   await this.roleService.update(id, { title: updateUserDto.role });
    // }
    return sanitize(existingUser, ['password', 'refreshToken']);
  }

  async setRoleInfo(user: User) {
    const userRole = await this.roleService.getRoleById(user.roleId);
    return Object.assign(user, {
      role: {
        roleId: userRole?.id ? userRole?.id : null,
        title: userRole?.title ? userRole?.title : null,
        shortForm: userRole?.shortForm ? userRole?.shortForm : null,
      },
    });
  }
}
