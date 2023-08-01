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

    const fileNameFromResponse = response?.body?.data?.fileName;

    expect(response?.status).toBe(201);
    expect(typeof fileNameFromResponse).toBe('string');
    expect(typeof response?.body?.data?.id).toBe('string');

    const uploadedImagePath = join(uploadDir, fileNameFromResponse);

    expect(existsSync(uploadedImagePath)).toBeTruthy();
    expect(await prisma.imageSource.count()).toBe(1);

    rmSync(uploadedImagePath);
  });

  beforeEach(async () => {
    await app.close();
  });
});
