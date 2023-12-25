import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './controllers/content.controller';
import { Content, ContentSchema } from './schema/content.schema';
import { ContentService } from './services/content.service';
import { AwsModule } from '../aws-upload/aws.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => AwsModule),
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  providers: [ContentService],
  exports: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
