import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './repositories/users-repository';
import { User } from './entities/user.entity';

interface CreateRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async getById(userId: string) {
    const userFound = await this.userRepository.getById(userId);

    if (!userFound) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return userFound;
  }
}
