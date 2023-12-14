import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payload } from 'src/shared/payload';
import { UserDocument } from '../schema/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(createDTO: CreateUserDto) {
    const { email } = createDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(createDTO);

    return await createdUser.save();
  }

  // sanitizeUser(user: User) {
  //   const sanitized = user;
  //   delete sanitized['password'];
  //   return sanitized;
  // }
  // async create(createUserDto: CreateUserDto): Promise<UserDocument> {
  //   const createdUser = new this.userModel(createUserDto);
  //   return createdUser.save();
  // }

  /** find */

  // async findByLogin(userDTO: LoginDto) {
  //   const { email, password } = userDTO;
  //   const user = await this.userModel.findOne({ email });
  //   if (!user) {
  //     throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
  //   }
  //   if (await bcrypt.compare(password, user.password)) {
  //     return this.sanitizeUser(user);
  //   } else {
  //     throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
  //   }
  // }
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
    return existingUser;
    // return this.userModel
    //   .findByIdAndUpdate(id, updateUserDto, { new: true })
    //   .exec();
  }
}
