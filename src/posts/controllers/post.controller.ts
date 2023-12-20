import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('create/post')
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Get()
  async getAllPosts() {
    const posts = await this.postService.getAllPosts();
    if (!posts) {
      throw new NotFoundException('Posts not found');
    }
    return posts;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Patch(':id')
  async updatepost(
    @Res() response,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    try {
      const existingPost = await this.postService.updatePost(id, updatePostDto);
      return response.status(HttpStatus.OK).json({
        message: 'Post has been successfully updated',
        existingPost,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
