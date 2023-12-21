// file: aws-s3 > src > app.controller.ts
import {
  Controller,
  Delete,
  FileTypeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';
import { diskStorage } from 'multer';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '/.(gif|jpe?g|png|svg|mp4)$/i',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.awsService.uploadFile(file);
  }

  @Delete('delete/:id')
  @UseInterceptors(FileInterceptor('file'))
  deleteFile(@Param() id: string) {
    return this.awsService.deleteFile(id);
  }
}
