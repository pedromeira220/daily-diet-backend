import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { compareSync, hashSync } from 'bcryptjs';

interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  password?: string;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  public isPasswordValid(password: string) {
    return compareSync(password, this.passwordHash);
  }

  static create(
    props: Optional<UserProps, 'passwordHash'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        passwordHash: props.passwordHash ?? hashSync(props.password ?? '', 6),
      },
      id,
    );

    return user;
  }
}
