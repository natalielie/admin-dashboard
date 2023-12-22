import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { Content, ContentDocument } from '../schema/content.schema';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { AwsService } from '../../aws-upload/aws.service';
import { ContentWithFile } from '../interfaces/content-with-file.interface';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    private readonly awsService: AwsService,
  ) {}

  /** create */

  async create(
    file: Express.Multer.File,
    id: string,
  ): Promise<ContentDocument> {
    const awsKey = (await this.awsService.uploadFile(file)).Key;

    const createdContent = new this.contentModel({
      awsKey: awsKey,
      parent: id[0],
    });
    return await createdContent.save();
  }

  /** get */

  async getContentById(
    id: string | Schema.Types.ObjectId,
  ): Promise<ContentWithFile> {
    const content = await this.contentModel.findById(id);
    if (!content) {
      throw new NotFoundException(`Content does not exist.`);
    }

    const contentFile = await this.awsService.getFile(content.awsKey);
    return { content, contentFile };
  }

  async getAllContent(): Promise<ContentWithFile[]> {
    return await this.contentModel.find();
  }

  /** delete */

  async deleteContent(id: string): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const chosenContent = await this.getContentById(id);

    await this.awsService.deleteFile(chosenContent.content.awsKey);

    const deletedContent = await this.contentModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedContent ? true : false);
  }

  /** update */

  public async updateContent(
    id: string | Schema.Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<UpdateResponseDto> {
    await this.getContentById(id);

    const awsKey: string = (await this.awsService.uploadFile(file)).Key;

    const updatedContent = await this.contentModel.findByIdAndUpdate(id, {
      awsKey: awsKey,
    });
    return ResponseHelper.updateResponse(updatedContent ? true : false, id);
  }
}
