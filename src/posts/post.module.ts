import { Module, Post, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { RolesModule } from 'src/roles/roles.module';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostSchema } from './schema/post.schema';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [
    forwardRef(() => RolesModule),
    forwardRef(() => ContentModule),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostService, JwtService],
  exports: [PostService, JwtService],
  controllers: [PostController],
})
export class PostModule {}
