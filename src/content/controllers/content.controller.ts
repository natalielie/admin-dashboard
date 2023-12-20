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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { ContentService } from '../services/content.service';

@UseGuards(AuthGuard)
@Controller('content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Post('create/content')
  async create(@Body() createContentDto: CreateContentDto) {
    return await this.contentService.create(createContentDto);
  }

  @Get()
  async getAllContents() {
    const Contents = await this.contentService.getAllContent();
    if (!Contents) {
      throw new NotFoundException('Contents not found');
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
  async updateContent(
    @Res() response,
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    try {
      const existingContent = await this.contentService.updateContent(
        id,
        updateContentDto,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Content has been successfully updated',
        existingContent,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.deleteContent(id);
  }
}
