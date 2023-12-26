import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './controllers/blog.controller';
import { Blog, BlogSchema } from './schema/blog.schema';
import { BlogService } from './services/blog.service';
import { AwsModule } from '../aws-upload/aws.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    forwardRef(() => AwsModule),
    forwardRef(() => RolesModule),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  providers: [BlogService],
  exports: [BlogService],
  controllers: [BlogController],
})
export class BlogModule {}
