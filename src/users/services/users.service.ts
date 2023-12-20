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

    return await createdUser.save();
  }

  /** get */

  async getByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById({ _id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
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
    return sanitize(updatedUser, ['password', 'refreshToken']);
  }

  /** delete */

  async remove(id: string | Schema.Types.ObjectId): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const deletedUser = await this.userModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedUser ? true : false);
  }
}
