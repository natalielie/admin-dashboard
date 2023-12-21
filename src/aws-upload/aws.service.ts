import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  SECRET_KEY,
} from 'src/utils/constants';

@Injectable()
export class AwsService {
  s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_KEY,
  });

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      AWS_BUCKET_NAME,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    const s3Response = await this.s3.upload(params).promise();
    if (!s3Response) {
      throw new BadRequestException('Something went wrong, try again');
    }
    return s3Response;
  }

  async deleteFile(key: string) {
    await this.s3
      .deleteObject({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
      })
      .promise();
  }
}
