import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { makeMeal } from '@test/factories/make-meal';
import { createAndAuthenticateUser } from '@test/utils/create-and-authenticate-user';
import { MealMapper } from '@v1/api/meals/mappers/meal.mapper';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { V1Module } from '@v1/v1.module';
import { addDays } from 'date-fns';
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

  it('/meals/{id} (PUT)', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const mealDate = new Date();

    const previousCreatedMeal = makeMeal({
      userId: previousCreatedUser.id,
      isOnDiet: true,
      mealDate,
    });
    const previousCreatedMealId = previousCreatedMeal.id.toString();

    const updatedMealDate = addDays(mealDate, 2);

    await prisma.meal.create({
      data: MealMapper.toPrisma(previousCreatedMeal),
    });

    const response = await request(app.getHttpServer())
      .put(`/meals/${previousCreatedMealId}`)
      .send({
        name: 'Updated meal name 123',
        description: 'Updated meal description 123',
        isOnDiet: false,
        mealDate: updatedMealDate,
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.description).toBe('Updated meal description 123');
    expect(response.body.data.name).toBe('Updated meal name 123');
    expect(response.body.data.isOnDiet).toBe(false);
    expect(response.body.data.mealDate).toBe(updatedMealDate.toISOString());
    expect(response.body.data.id).toBe(previousCreatedMealId);
  });

  it('/meals/metrics/meals-count (GET)', async () => {
    const MEALS_COUNT = 5;

    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    for (let i = 0; i < MEALS_COUNT; i++) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(makeMeal({ userId: previousCreatedUser.id })),
      });
    }

    const response = await request(app.getHttpServer())
      .get('/meals/metrics/meals-count')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.value).toBe(MEALS_COUNT);
  });

  it('should count meals from user that are on diet', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const MEALS_COUNT_THAT_ARE_ON_DIET = 10;
    const MEALS_COUNT_THAT_ARE_NOT_ON_DIET = 7;

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_ON_DIET; i++) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(
          makeMeal({ userId: previousCreatedUser.id, isOnDiet: true }),
        ),
      });
    }

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_NOT_ON_DIET; i++) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(
          makeMeal({ userId: previousCreatedUser.id, isOnDiet: false }),
        ),
      });
    }

    const response = await request(app.getHttpServer())
      .get('/meals/metrics/meals-count')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ isOnDiet: true });

    expect(response.body.data.value).toBe(MEALS_COUNT_THAT_ARE_ON_DIET);
  });

  it('should count meals from user that are not on diet', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const MEALS_COUNT_THAT_ARE_ON_DIET = 10;
    const MEALS_COUNT_THAT_ARE_NOT_ON_DIET = 7;

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_ON_DIET; i++) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(
          makeMeal({ userId: previousCreatedUser.id, isOnDiet: true }),
        ),
      });
    }

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_NOT_ON_DIET; i++) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(
          makeMeal({ userId: previousCreatedUser.id, isOnDiet: false }),
        ),
      });
    }

    const response = await request(app.getHttpServer())
      .get('/meals/metrics/meals-count')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ isOnDiet: false });

    expect(response.body.data.value).toBe(MEALS_COUNT_THAT_ARE_NOT_ON_DIET);
  });

  it('should count meals best sequence', async () => {
    const { accessToken, previousCreatedUser } =
      await createAndAuthenticateUser(app, prisma);

    const userId = previousCreatedUser.id;
    const bestSequence = 4;

    const daysOnDiet = [
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
    ];

    for await (const [index, currentDayIsOnDiet] of daysOnDiet.entries()) {
      await prisma.meal.create({
        data: MealMapper.toPrisma(
          makeMeal({
            userId,
            isOnDiet: currentDayIsOnDiet,
            mealDate: addDays(new Date(), index),
          }),
        ),
      });
    }

    const response = await request(app.getHttpServer())
      .get('/meals/metrics/best-sequence')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.body.data.value).toBe(bestSequence);
  });

  beforeEach(async () => {
    await app.close();
  });
});
