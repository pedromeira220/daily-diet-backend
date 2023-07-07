import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersRepository } from '../users/repositories/users-repository';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async registerUser({
    email,
    name,
    password,
  }: RegisterUserRequest): Promise<User> {
    const checkIfEmailIsAlreadyInUse = await this.usersRepository.getByEmail(
      email,
    );

    if (!!checkIfEmailIsAlreadyInUse) {
      throw new BadRequestException('Email já está em uso');
    }

    const user = User.create({
      email,
      name,
      password,
    });

    await this.usersRepository.create(user);

    return user;
  }
}
