import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { V1Module } from '@v1/v1.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [V1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get(PrismaService);
  });

  it('/users/{id} (GET)', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const response = await request(app.getHttpServer())
      .get(`/users/${previousCreatedUser.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(previousCreatedUser.id.toString());
  });

  beforeEach(async () => {
    await app.close();
  });
});
