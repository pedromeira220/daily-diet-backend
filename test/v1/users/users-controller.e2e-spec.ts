import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { V1Module } from '@v1/v1.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [V1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/{id} (GET)', async () => {
    const { access_token, previousCreatedUserId } =
      await createAndAuthenticateUser(app);

    const response = await request(app.getHttpServer())
      .get(`/users/${previousCreatedUserId}`)
      .set('Authorization', `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(previousCreatedUserId);
  });

  beforeEach(async () => {
    await app.close();
  });
});
