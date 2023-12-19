import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { sanitize } from 'src/utils/sanitize.function';
import { Payload } from 'src/auth/interfaces/auth.interface';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { hashData } from 'src/utils/hash.functions';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /** create */

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await hashData(createUserDto.password);
    createUserDto.password = hash;
    const createdUser = new this.userModel(createUserDto);

    await createdUser.save();

    return sanitize(createdUser, ['password', 'refreshToken']);
  }

  /** get */

  async getByLogin(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async getByPayload(payload: Payload): Promise<UserDocument> {
    const { email } = payload.user;
    return await this.userModel.findOne({ email });
  }

  async getAll(): Promise<UserDocument[]> {
    const users = await this.userModel.find().exec();
    return users;
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById({ _id: id });
    return sanitize(user, ['password', 'refreshToken']);
  }

  /** update */

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return updatedUser;
  }

  /** delete */

  async remove(id: string | Schema.Types.ObjectId): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const deletedUser = await this.userModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedUser ? true : false);
  }
}
