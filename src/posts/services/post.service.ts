import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { ResponseHelper } from 'src/utils/response';
import { DeleteResponseDto } from 'src/utils/dto/delete-response.dto';
import { PostDocument } from '../schema/post.schema';
import { UpdateResponseDto } from 'src/utils/dto/update-response.dto';
import { ContentService } from 'src/content/services/content.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly contentService: ContentService,
  ) {}

  /** create */

  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    const { title } = createPostDto;
    const post = await this.postModel.findOne({ title });
    if (post) {
      throw new HttpException(
        'Post with such title already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdPost = new this.postModel({
      ...createPostDto,
      date: new Date(),
    });

    return await createdPost.save();
  }

  /** get */

  async getByTitle(title: string): Promise<PostDocument> {
    return this.postModel.findOne({ title: title });
  }

  async getPostById(id: string | Schema.Types.ObjectId): Promise<PostDocument> {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException(`Post does not exist.`);
    }

    return post;
  }

  async getAllPosts(): Promise<PostDocument[]> {
    return this.postModel.find();
  }

  /** delete */

  async deletePost(id: string): Promise<DeleteResponseDto> {
    const filter = { _id: id };

    const attachedFileId = await this.contentService.getIdByParent(
      id.toString(),
    );
    if (attachedFileId) {
      await this.contentService.deleteContent(attachedFileId);
    }

    const deletedPost = await this.postModel.deleteOne(filter);
    return ResponseHelper.deleteResponse(deletedPost ? true : false);
  }

  /** update */

  public async updatePost(
    id: string | Schema.Types.ObjectId,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdateResponseDto> {
    await this.getPostById(id);

    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
    );

    return ResponseHelper.updateResponse(updatedPost ? true : false, id);
  }
}
