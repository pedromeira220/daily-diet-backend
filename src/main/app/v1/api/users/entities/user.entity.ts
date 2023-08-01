import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { compareSync, hashSync } from 'bcryptjs';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  password?: string;
  avatarId: UniqueEntityId | null;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get avatarId() {
    return this.props.avatarId;
  }

  set avatarId(value: UniqueEntityId | null) {
    this.props.avatarId = value;
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
