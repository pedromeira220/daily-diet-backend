import { Entity } from '@v1/common/entities/entity.entity';
import { compareSync } from 'bcryptjs';

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
}
