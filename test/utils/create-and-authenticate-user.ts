import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { makeApplicationUser } from '@test/factories/make-application-user';
import { UserMapper } from '@v1/api/users/mappers/user.mapper';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import * as request from 'supertest';

export const createAndAuthenticateUser = async (
  app: INestApplication<any>,
  prisma: PrismaService,
) => {
  const email = faker.internet.email();
  const password = faker.internet.password();

  const previousCreatedUser = makeApplicationUser({
    password,
    email,
  });

  await prisma.user.create({
    data: UserMapper.toPrisma(previousCreatedUser),
  });

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email,
      password,
    });

  const accessToken = loginResponse.body.data.token;

  return {
    previousCreatedUser,
    accessToken,
  };
};
