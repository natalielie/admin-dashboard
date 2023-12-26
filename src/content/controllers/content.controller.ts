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
import { ContentService } from '../services/content.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from 'src/utils/multer/constants';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @Post('create/content/:id')
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
    return await this.contentService.create(file, id);
  }

  @Get()
  async getAllContentInfo() {
    const Contents = await this.contentService.getAllContent();
    if (!Contents) {
      throw new NotFoundException('Content not found');
    }
    return Contents;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const Content = await this.contentService.getContentById(id);
    if (!Content) {
      throw new NotFoundException('Content not found');
    }
    return Content;
  }

  @Patch(':id')
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  async updateContent(
    @Res() response,
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    try {
      const existingContent = await this.contentService.updateContent(id, file);
      return response.status(HttpStatus.OK).json({
        message: 'Content has been successfully updated',
        existingContent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.deleteContent(id);
  }
}
