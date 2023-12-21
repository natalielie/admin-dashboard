import { Module, forwardRef } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { ContentModule } from 'src/content/content.module';

@Module({
  imports: [forwardRef(() => ContentModule)],
  providers: [AwsService],
  exports: [AwsService],
  controllers: [AwsController],
})
export class AwsModule {}
