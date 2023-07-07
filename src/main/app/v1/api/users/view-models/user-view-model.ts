import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UserDTO } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export class UserViewModel {
  static toHttp(user: User): ResponseDTO<UserDTO> {
    return new ResponseDTO({ data: this.toDTO(user) });
  }

  static toDTO(user: User): UserDTO {
    return new UserDTO(user.id.toValue(), user.name, user.email);
  }
}
