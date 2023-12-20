import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UpdateContentDto } from '../dto/update-content.dto';
import { CreateContentDto } from '../dto/create-content.dto';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { Content, ContentDocument } from '../schema/content.schema';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { AwsService } from '../aws-upload/aws.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @Inject('AwsService') private readonly awsService: AwsService,
  ) {}

  /** create */

  async create(createContentDto: CreateContentDto): Promise<ContentDocument> {
    const content = await this.contentModel.findOne(createContentDto);
    if (content) {
      throw new HttpException(
        'Such content already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdContent = new this.contentModel({
      ...createContentDto,
      date: new Date(),
    });

    this.awsService.uploadFile(createContentDto.source);

    return await createdContent.save();
  }

  /** get */

  async getByTitle(title: string): Promise<ContentDocument> {
    return this.contentModel.findOne({ title: title });
  }

  async getContentById(
    id: string | Schema.Types.ObjectId,
  ): Promise<ContentDocument> {
    const content = await this.contentModel.findById(id);
    if (!content) {
      throw new NotFoundException(`Content does not exist.`);
    }

    return content;
  }

  async getAllContent(): Promise<ContentDocument[]> {
    return this.contentModel.find();
  }

  /** delete */

  async deleteContent(id: string): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const deletedContent = await this.contentModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedContent ? true : false);
  }

  /** update */

  public async updateContent(
    id: string | Schema.Types.ObjectId,
    updateContentDto: UpdateContentDto,
  ): Promise<UpdateResponseDto> {
    await this.getContentById(id);

    const updatedContent = await this.contentModel.findByIdAndUpdate(
      id,
      updateContentDto,
    );

    return ResponseHelper.updateResponse(updatedContent ? true : false, id);
  }
}
