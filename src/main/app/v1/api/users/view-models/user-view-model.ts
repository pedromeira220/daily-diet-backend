import { UserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export class UserViewModel {
  static toDTO(user: User): UserDTO {
    return new UserDTO(user.id.toValue(), user.name, user.email);
  }
}
