import { BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { loadEnvVariables } from '@test/utils/load-env-variables';
import { User } from '../users/entities/user.entity';
import { InMemoryUsersRepository } from '../users/repositories/implementations/in-memory/in-memory-users-repository';
import { UsersRepository } from '../users/repositories/users-repository';
import { AuthService } from './auth.service';
import { InvalidPasswordOrEmailError } from './errors/invalid-password-or-email.error';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthService', () => {
  let repository: InMemoryUsersRepository;
  let service: AuthService;
  loadEnvVariables();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          useFactory: () => {
            return {
              secret: process.env.JWT_SECRET,
              signOptions: { expiresIn: '10d' },
            };
          },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useClass: InMemoryUsersRepository,
        },
        LocalStrategy,
        JwtStrategy,
      ],
    }).compile();

    repository = module.get<InMemoryUsersRepository>(UsersRepository);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to register an user', async () => {
    const registeredUser = await service.registerUser({
      email: 'john@example.com',
      name: 'John doe',
      password: '12345',
    });

    expect(typeof registeredUser.id.toString()).toBe('string');
  });

  it('should not be able to register an user with a already in use email', async () => {
    const alreadyInUseEmail = 'john@example.com';

    const previousRegisteredUser = User.create({
      email: alreadyInUseEmail,
      name: 'John Doe',
      password: '12345',
    });

    repository.users.push(previousRegisteredUser);

    expect(async () => {
      await service.registerUser({
        email: alreadyInUseEmail,
        name: 'Another name',
        password: '12345',
      });
    }).rejects.toThrowError(BadRequestException);
  });

  it('should validate user for login with correct password and email', async () => {
    const password = '12345';
    const email = 'john@example.com';

    const registeredUser = await service.registerUser({
      email,
      name: 'John doe',
      password,
    });

    const user = await service.validateUserForLogin({ email, password });

    expect(user.id.toString()).toBe(registeredUser.id.toString());
  });

  it('should not validate user for login with incorrect password', async () => {
    const password = '12345';
    const email = 'john@example.com';

    await service.registerUser({
      email,
      name: 'John doe',
      password,
    });

    expect(async () => {
      await service.validateUserForLogin({
        email,
        password: 'incorrect-passsword',
      });
    }).rejects.toThrowError(InvalidPasswordOrEmailError);
  });

  it('should not validate user for login with incorrect email', async () => {
    const password = '12345';
    const email = 'john@example.com';

    await service.registerUser({
      email,
      name: 'John doe',
      password,
    });

    expect(async () => {
      await service.validateUserForLogin({
        email: 'incorrect-email@example.com',
        password,
      });
    }).rejects.toThrowError(InvalidPasswordOrEmailError);
  });
});
