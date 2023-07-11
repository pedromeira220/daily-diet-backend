import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { V1Module } from '@v1/v1.module';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [V1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@email.com',
        password: '12345',
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });

  beforeEach(async () => {
    await app.close();
  });
});
