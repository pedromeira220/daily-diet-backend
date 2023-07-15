import { PrismaClient } from '@prisma/client';
import { makeMeal } from '@test/factories/make-meal';
import { makeUser } from '@test/factories/make-user';
import { MealMapper } from '@v1/api/meals/mappers/meal.mapper';
import { UserMapper } from '@v1/api/users/mappers/user.mapper';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const prisma = new PrismaClient({
  log: ['query'],
});

const createUsers = async () => {
  const COUNT_OF_USERS_TO_CREATE = getRandomArbitrary(300, 600);

  const userIdList: string[] = [];

  const usersToCreate = Array.from({ length: COUNT_OF_USERS_TO_CREATE }).map(
    () => {
      const userToCreate = makeUser();

      userIdList.push(userToCreate.id.toString());
      return UserMapper.toPrisma(userToCreate);
    },
  );

  await prisma.user.createMany({
    data: usersToCreate,
  });

  for await (const [index, id] of userIdList.entries()) {
    await createMealsForUser(id);
  }
};

const createMealsForUser = async (userId: string) => {
  const COUNT_OF_MEALS_TO_CREATE = getRandomArbitrary(400, 600);

  await prisma.meal.createMany({
    data: Array.from({ length: COUNT_OF_MEALS_TO_CREATE }).map(() => {
      const mealToCreate = makeMeal({ userId: new UniqueEntityId(userId) });

      return MealMapper.toPrisma(mealToCreate);
    }),
  });
};

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const main = async () => {
  createUsers();
};

main();
