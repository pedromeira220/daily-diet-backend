import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { Path } from '@v1/common/value-objects/path';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { V1Module } from '@v1/v1.module';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import * as request from 'supertest';

describe('FileUploaderController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [V1Module],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = moduleFixture.get(PrismaService);

    await app.init();
  });

  it('/file-uploader/upload (POST)', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, prisma);

    const imagePath = new Path(
      __dirname,
      '..',
      '..',
      'images',
      'test-image.png',
    );

    const uploadDir = join(__dirname, '..', '..', '..', 'uploads');

    const response = await request(app.getHttpServer())
      .post('/file-uploader/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', imagePath.toString());

    console.log('> response.body', response.body);

    expect(response?.status).toBe(201);
    expect(typeof response?.body?.fileName).toBe('string');

    const uploadedImagePath = join(uploadDir, response?.body?.fileName);

    expect(existsSync(uploadedImagePath)).toBeTruthy();

    rmSync(uploadedImagePath);
  });

  beforeEach(async () => {
    await app.close();
  });
});
