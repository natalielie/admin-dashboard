import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../services/aws.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/utils/role.enum';
import { fileFilter } from 'src/utils/multer/constants';

@Roles(Role.Admin)
@UseGuards(RoleGuard)
@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.awsService.uploadFile(file);
  }

  @Get(':key')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  getFileByKey(@Param() key: string) {
    return this.awsService.getFile(key);
  }

  @Delete(':key')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  deleteFile(@Param() key: string) {
    return this.awsService.deleteFile(key);
  }
}
