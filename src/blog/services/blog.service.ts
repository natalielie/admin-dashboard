import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { Blog, BlogDocument } from '../schema/blog.schema';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { AwsService } from '../../aws-upload/services/aws.service';
import { BlogWithFile } from '../interfaces/blog-with-file.interface';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    private readonly awsService: AwsService,
  ) {}

  /** create */

  async create(file: Express.Multer.File, id: string): Promise<BlogDocument> {
    const awsKey = (await this.awsService.uploadFile(file)).Key;

    const createdBlog = new this.blogModel({
      awsKey: awsKey,
      parent: id,
    });
    return await createdBlog.save();
  }

  /** get */

  async getBlogById(id: string | Schema.Types.ObjectId): Promise<BlogWithFile> {
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new NotFoundException(`Blog does not exist.`);
    }

    const blogFile = await this.awsService.getFile(blog.awsKey);
    return { blog, blogFile };
  }

  async getAllBlog(): Promise<BlogWithFile[]> {
    return await this.blogModel.find();
  }

  async getIdByParent(parentId: string): Promise<string> {
    const blog = await this.blogModel.findOne({ parent: parentId });
    if (!blog) {
      throw new NotFoundException(`Blog does not exist.`);
    }
    return blog._id.toString();
  }

  /** delete */

  async deleteBlog(id: string): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const chosenBlog = await this.getBlogById(id);
    if (!chosenBlog) {
      throw new NotFoundException(`Blog does not exist.`);
    }
    await this.awsService.deleteFile(chosenBlog.blog.awsKey);

    const deletedBlog = await this.blogModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedBlog ? true : false);
  }

  /** update */

  public async updateBlog(
    id: string | Schema.Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<UpdateResponseDto> {
    await this.getBlogById(id);

    const awsKey: string = (await this.awsService.uploadFile(file)).Key;

    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, {
      awsKey: awsKey,
    });
    return ResponseHelper.updateResponse(updatedBlog ? true : false, id);
  }
}
