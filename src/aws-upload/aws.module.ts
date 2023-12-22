import { Module, forwardRef } from '@nestjs/common';
import { AwsService } from './services/aws.service';
import { AwsController } from './controllers/aws.controller';
import { ContentModule } from 'src/content/content.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [forwardRef(() => ContentModule), forwardRef(() => RolesModule)],
  providers: [AwsService],
  exports: [AwsService],
  controllers: [AwsController],
})
export class AwsModule {}
