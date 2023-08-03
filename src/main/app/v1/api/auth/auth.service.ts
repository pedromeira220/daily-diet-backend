import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApplicationUser } from '../users/entities/application-user.entity';
import { UsersRepository } from '../users/repositories/users-repository';
import { InvalidPasswordOrEmailError } from './errors/invalid-password-or-email.error';
import { AuthUser } from './models/auth-user.model';
import { UserPayload } from './models/user-payload.model';

interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser({
    email,
    name,
    password,
  }: RegisterUserRequest): Promise<ApplicationUser> {
    const checkIfEmailIsAlreadyInUse = await this.usersRepository.getByEmail(
      email,
    );

    if (!!checkIfEmailIsAlreadyInUse) {
      throw new BadRequestException('Email já está em uso');
    }

    const user = ApplicationUser.create({
      email,
      name,
      password,
      avatarId: null,
    });

    await this.usersRepository.create(user);

    return user;
  }

  async validateUserForLogin({ email, password }: LoginRequest) {
    const userFound = await this.usersRepository.getByEmail(email);

    if (!userFound) {
      throw new InvalidPasswordOrEmailError();
    }

    const isPasswordValid = userFound.isPasswordValid(password);

    if (!isPasswordValid) {
      throw new InvalidPasswordOrEmailError();
    }

    return userFound;
  }

  async login(user: AuthUser) {
    const payload: UserPayload = {
      sub: user.userId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
