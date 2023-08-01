import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { uploadImage } from '@test/utils/upload-image';
import { FileUploaderService } from '@v1/api/file-uploader/file-uploader.service';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { V1Module } from '@v1/v1.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let fileUploaderService: FileUploaderService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [V1Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = moduleFixture.get(PrismaService);
    fileUploaderService = moduleFixture.get(FileUploaderService);
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

  it('/users (PUT)', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const { imageSource, removeFromDiscUploadedFile } = await uploadImage(
      fileUploaderService,
    );

    const response = await request(app.getHttpServer())
      .put(`/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Updated name',
        avatar: {
          id: imageSource.id.toString(),
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(previousCreatedUser.id.toString());
    expect(response.body.data.name).toBe('Updated name');

    const userFromDb = await prisma.user.findUnique({
      where: {
        id: previousCreatedUser.id.toString(),
      },
    });

    expect(userFromDb?.avatar_id).toBe(imageSource.id.toString());

    removeFromDiscUploadedFile();
  });

  beforeEach(async () => {
    await app.close();
  });
});
