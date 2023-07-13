import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export const createAndAuthenticateUser = async (app: INestApplication<any>) => {
  const email = 'john@email.com';
  const password = '12345';

  const registerResponse = await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      name: 'John Doe',
      email,
      password,
    });

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email,
      password,
    });

  const previousCreatedUserId = registerResponse.body.data.id;
  const access_token = loginResponse.body.data.token;

  return {
    previousCreatedUserId,
    access_token,
  };
};
