import { Injectable, NotFoundException } from '@nestjs/common';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { ImageSource } from '../file-uploader/entities/image-source.entity';
import { ImageSourceRepository } from '../file-uploader/repositories/image-source.repository';
import { ApplicationUser } from './entities/application-user.entity';
import { Profile } from './entities/profile.entity';
import { UsersRepository } from './repositories/users-repository';

interface UpdateById {
  userId: string;
  name?: string;
  avatar?: ImageSource | null;
}

interface GetProfileRequest {
  userId: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly imageSourceRepository: ImageSourceRepository,
  ) {}

  async getById(userId: string) {
    const userFound = await this.userRepository.getById(userId);

    if (!userFound) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return userFound;
  }

  async updateById({
    userId,
    name,
    avatar,
  }: UpdateById): Promise<ApplicationUser> {
    const userFound = await this.getById(userId);

    if (avatar != null && avatar != undefined) {
      const imageSourceExists = await this.imageSourceRepository.getById(
        avatar.id.toString(),
      );

      if (!imageSourceExists) {
        throw new NotFoundException('Avatar não encontrado');
      }
    }

    console.log('> previous name', userFound.name);
    console.log('>  name from params', name);

    if (typeof name != 'undefined') userFound.name = name;
    if (typeof avatar != 'undefined')
      userFound.avatarId =
        avatar == null ? null : new UniqueEntityId(avatar.id.toString());

    console.log('>  name after update', name);

    await this.userRepository.save(userFound);

    return userFound;
  }

  async getProfile({ userId }: GetProfileRequest) {
    const userFound = await this.getById(userId);

    const profile = Profile.create(
      {
        email: userFound.email,
        name: userFound.name,
        passwordHash: userFound.passwordHash,
        avatar: !!userFound.avatarId
          ? await this.imageSourceRepository.getById(
              userFound.avatarId.toString(),
            )
          : null,
      },
      userFound.id,
    );

    return profile;
  }
}
