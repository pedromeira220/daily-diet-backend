import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { User, UserProps } from './user.entity';

export interface ApplicationUserProps extends UserProps {
  avatarId: UniqueEntityId | null;
}

export class ApplicationUser extends User<ApplicationUserProps> {
  get avatarId() {
    return this.props.avatarId;
  }

  set avatarId(value: UniqueEntityId | null) {
    this.props.avatarId = value;
  }

  static create(
    props: Optional<ApplicationUserProps, 'passwordHash'>,
    id?: UniqueEntityId,
  ) {
    const applicationUser = new ApplicationUser(
      User.makeProps<ApplicationUserProps>({
        ...props,
      }),
      id,
    );

    return applicationUser;
  }
}
