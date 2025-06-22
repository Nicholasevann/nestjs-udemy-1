import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  const config = new DocumentBuilder()
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
