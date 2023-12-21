import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UpdateContentDto } from '../dto/update-content.dto';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { Content, ContentDocument } from '../schema/content.schema';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { AwsService } from '../../aws-upload/aws.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    private readonly awsService: AwsService,
  ) {}

  /** create */

  async create(
    file: Express.Multer.File,
    parent = 'gfjgkl;ljgfhhgjkl;',
  ): Promise<ContentDocument> {
    const awsKey = (await this.awsService.uploadFile(file)).Key;

    const createdContent = new this.contentModel({
      awsKey: awsKey,
      parent: parent,
      date: new Date(),
    });
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

    const chosenContent = await this.getContentById(id);

    await this.awsService.deleteFile(chosenContent.awsKey);

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
