import { faker } from '@faker-js/faker';
import { User, UserProps } from '@v1/api/users/entities/user.entity';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const meal = User.create(
    {
      name: faker.person.fullName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  );

  return meal;
}
