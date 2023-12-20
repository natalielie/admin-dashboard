import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';

@Module({
  imports: [],
  providers: [AwsService],
  exports: [AwsService],
  controllers: [AwsController],
})
export class AwsModule {}
