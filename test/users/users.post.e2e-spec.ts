/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { dropDatabase } from 'test/helpers/drop-database.helper';
import { bootstrapNesstApp } from 'test/helpers/bootstrao-nest-app.hrlper';
import * as request from 'supertest';
import {
  completeUser,
  missingEmailUser,
  missingFirstNameUser,
  missingPasswordUser,
} from './users.post.e2e-spec.sample';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    app = await bootstrapNesstApp();
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });
  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });
  it('should fail if email is missing', () => {
    return request(httpServer)
      .post('/users')
      .send(missingEmailUser)
      .expect(400);
  });
  it('should fail if password is missing', () => {
    return request(httpServer)
      .post('/users')
      .send(missingPasswordUser)
      .expect(400);
  });
  it('should fail if firstName is missing', () => {
    return request(httpServer)
      .post('/users')
      .send(missingFirstNameUser)
      .expect(400);
  });

  it('should create user with valid fields', () => {
    return request(httpServer).post('/users').send(completeUser).expect(201);
  });
});
