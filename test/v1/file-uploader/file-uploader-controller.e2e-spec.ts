import { AppModule } from '@/main/app/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { Path } from '@v1/common/value-objects/path';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import axios from 'axios';
import * as request from 'supertest';

describe.only('FileUploaderController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    const response = await request(app.getHttpServer())
      .post('/file-uploader/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', imagePath.toString());

    const fileSrc = response?.body?.data?.src;

    expect(response?.status).toBe(201);
    expect(typeof fileSrc).toBe('string');
    expect(typeof response?.body?.data?.id).toBe('string');

    const imgResponse = await axios.get(fileSrc);

    expect(imgResponse.status).toBe(200);
  });

  beforeEach(async () => {
    await app.close();
  });
});
