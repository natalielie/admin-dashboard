import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  SECRET_KEY,
} from 'src/utils/constants';

@Injectable()
export class AwsService {
  AWS_S3_BUCKET = AWS_BUCKET_NAME;
  s3 = new AWS.S3({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_KEY,
  });

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
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

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }
}
