import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { makeMeal } from '@test/factories/make-meal';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { MealMapper } from '@v1/api/meals/mappers/meal.mapper';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { V1Module } from '@v1/v1.module';
import * as request from 'supertest';

describe('MealsController (e2e)', () => {
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

  it('/meals (POST)', async () => {
    const { accessToken } = await createAndAuthenticateUser(app, prisma);

    const response = await request(app.getHttpServer())
      .post('/meals')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Sandwich',
        description: 'A sandwich with cheese and ham',
        isOnDiet: true,
        mealDate: new Date().toISOString(),
      });

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe('Sandwich');
  });

  it('/meals/{id} (GET)', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const previousCreatedMeal = makeMeal({ userId: previousCreatedUser.id });
    const previousCreatedMealId = previousCreatedMeal.id.toString();

    await prisma.meal.create({
      data: MealMapper.toPrisma(previousCreatedMeal),
    });

    const response = await request(app.getHttpServer())
      .get(`/meals/${previousCreatedMealId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(previousCreatedMealId);
  });

  it('/meals/{id} (DELETE)', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const previousCreatedMeal = makeMeal({ userId: previousCreatedUser.id });
    const previousCreatedMealId = previousCreatedMeal.id.toString();

    await prisma.meal.create({
      data: MealMapper.toPrisma(previousCreatedMeal),
    });

    const response = await request(app.getHttpServer())
      .delete(`/meals/${previousCreatedMealId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);
  });

  beforeEach(async () => {
    await app.close();
  });
});
