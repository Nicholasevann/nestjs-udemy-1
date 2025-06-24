import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}

  public async fileUpload(file: Express.Multer.File): Promise<string> {
    const s3 = new S3({
      region: this.configService.get('appConfig.awsRegion'),
      accessKeyId: this.configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: this.configService.get('appConfig.awsSecretAccessKey'),
    });
    try {
      const uploadParams = {
        Bucket: this.configService.get('appConfig.awsBucketName'),
        Key: this.generateFileName(file),
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const result = await s3.upload(uploadParams).promise();
      return result.Key;
    } catch (error) {
      throw new RequestTimeoutException(`File upload failed: ${error.message}`);
    }
  }
  generateFileName(file: Express.Multer.File): string {
    const timestamp = Date.now().toString().trim();
    const name = file.originalname.split('.')[0];
    name.replace(/\s/g, ''); // Replace spaces with empty string
    const fileExtension = file.originalname.split('.').pop();
    return `${timestamp}-${name}-${uuidv4()}.${fileExtension}`;
  }
}
