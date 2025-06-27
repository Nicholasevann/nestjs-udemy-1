import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
export function appCreate(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if a property is not whitelisted
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit conversion of types
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setTermsOfService('https://example.com/terms')
    .setLicense('MIT', 'https://example.com/license')
    .addServer(
      process.env.NODE_ENV === 'production'
        ? 'https://api.example.com'
        : 'http://localhost:3000',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get<string>('appConfig.awsAccessKeyId') ?? '',
      secretAccessKey:
        configService.get<string>('appConfig.awsSecretAccessKey') ?? '',
    },
    region: configService.get<string>('appConfig.awsRegion'),
  });
  app.enableCors();
}
