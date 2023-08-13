import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { compareSync, hashSync } from 'bcryptjs';

export interface UserProps {
  name: string;
  email: string;
  passwordHash: string;
  password?: string;
}

export abstract class User<Props extends UserProps> extends Entity<Props> {
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

  public isPasswordValid(password: string) {
    return compareSync(password, this.passwordHash);
  }

  static makeProps<Props extends UserProps>(
    props: Optional<Props, 'passwordHash'>,
  ) {
    return {
      ...props,
      passwordHash: props.passwordHash ?? hashSync(props.password ?? '', 6),
    };
  }
}
