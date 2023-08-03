import { faker } from '@faker-js/faker';
import { ApplicationUser } from '@v1/api/users/entities/application-user.entity';
import { UserProps } from '@v1/api/users/entities/user.entity';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

export function makeApplicationUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {
  const meal = ApplicationUser.create(
    {
      name: faker.person.fullName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      avatarId: null,
      ...override,
    },
    id,
  );

  return meal;
}
