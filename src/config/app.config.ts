import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION || '1.0',
  awsBucketName: process.env.AWS_BUCKET_NAME || 'default-bucket',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'default-access-key',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'default-secret-key',
  awsCloudFrontUrl:
    process.env.AWS_CLOUDFRONT_URL || 'https://default.cloudfront.net',
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
}));
