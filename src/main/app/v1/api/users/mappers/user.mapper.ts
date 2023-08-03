import { User as UserRaw } from '@prisma/client';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { ApplicationUserDTO } from '../dtos/application-user.dto';
import { ApplicationUser } from '../entities/application-user.entity';

export class UserMapper {
  static toHttp(user: ApplicationUser): ResponseDTO<ApplicationUserDTO> {
    return new ResponseDTO({ data: this.toDTO(user) });
  }

  static toDTO(user: ApplicationUser): ApplicationUserDTO {
    return new ApplicationUserDTO({
      name: user.name,
      avatarId: !!user.avatarId ? user.avatarId.toString() : null,
      email: user.email,
      id: user.id.toString(),
    });
  }

  static toDomain(raw: UserRaw): ApplicationUser {
    return ApplicationUser.create(
      {
        name: raw.name,
        email: raw.email,
        passwordHash: raw.password_hash,
        avatarId: !!raw.avatar_id ? new UniqueEntityId(raw.avatar_id) : null,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(user: ApplicationUser): UserRaw {
    return {
      email: user.email,
      id: user.id.toString(),
      name: user.name,
      password_hash: user.passwordHash,
      avatar_id: !!user.avatarId ? user.avatarId.toString() : null,
    };
  }
}
