import { PrismaClient } from '@prisma/client';
import { makeApplicationUser } from '@test/factories/make-application-user';
import { makeMeal } from '@test/factories/make-meal';
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

  const userIdList: UniqueEntityId[] = [];

  const usersToCreate = Array.from({ length: COUNT_OF_USERS_TO_CREATE }).map(
    (_, index) => {
      if (index == 0) {
        const userToCreate = makeApplicationUser({
          email: index == 0 ? 'admin@admin.com' : undefined,
          name: index == 0 ? 'Admin' : undefined,
          password: index == 0 ? 'admin123' : undefined,
        });

        userIdList.push(userToCreate.id);
        return UserMapper.toPrisma(userToCreate);
      }

      const userToCreate = makeApplicationUser();

      userIdList.push(userToCreate.id);
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

const createMealsForUser = async (userId: UniqueEntityId) => {
  const COUNT_OF_MEALS_TO_CREATE = getRandomArbitrary(400, 600);

  await prisma.meal.createMany({
    data: Array.from({ length: COUNT_OF_MEALS_TO_CREATE }).map(() => {
      const mealToCreate = makeMeal({ userId });

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
