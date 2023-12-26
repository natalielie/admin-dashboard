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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BlogService } from '../services/blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/utils/multer/constants';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';

@UseGuards(AuthGuard)
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Post('create/blog')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() id: string,
  ) {
    return await this.blogService.create(file, id);
  }

  @Get()
  async getAllBlogInfo() {
    const Blogs = await this.blogService.getAllBlog();
    if (!Blogs) {
      throw new NotFoundException('Blog not found');
    }
    return Blogs;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const Blog = await this.blogService.getBlogById(id);
    if (!Blog) {
      throw new NotFoundException('Blog not found');
    }
    return Blog;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async updateBlog(
    @Res() response,
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const existingBlog = await this.blogService.updateBlog(id, file);
      return response.status(HttpStatus.OK).json({
        message: 'Blog has been successfully updated',
        existingBlog,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }
}
