import { faker } from '@faker-js/faker';
import { Meal, MealProps } from '@v1/api/meals/entities/meal.entity';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

export function makeMeal(
  override: Partial<MealProps> = {},
  id?: UniqueEntityId,
) {
  const meal = Meal.create(
    {
      name: faker.animal.fish(),
      description: faker.lorem.text(),
      isOnDiet: faker.datatype.boolean(),
      mealDate: faker.date.recent(),
      ...override,
    },
    id,
  );

  return meal;
}
