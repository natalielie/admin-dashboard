import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './controllers/content.controller';
import { Content, ContentSchema } from './schema/content.schema';
import { ContentService } from './services/content.service';
import { AwsModule } from './aws-upload/aws.module';

@Module({
  imports: [
    AwsModule,
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  providers: [ContentService],
  exports: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
