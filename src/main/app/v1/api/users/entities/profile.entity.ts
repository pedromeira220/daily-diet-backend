import { ImageSource } from '@v1/api/file-uploader/entities/image-source.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { User, UserProps } from './user.entity';

interface ProfileProps extends UserProps {
  avatar: ImageSource | null;
}

export class Profile extends User<ProfileProps> {
  get avatar() {
    return this.props.avatar;
  }

  static create(
    props: Optional<ProfileProps, 'passwordHash'>,
    id?: UniqueEntityId,
  ) {
    const user = new Profile(
      User.makeProps<ProfileProps>({
        ...props,
      }),
      id,
    );

    return user;
  }
}
