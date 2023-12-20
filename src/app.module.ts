import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import 'dotenv/config';
import { PostModule } from './posts/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    UsersModule,
    AuthModule,
    RolesModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
