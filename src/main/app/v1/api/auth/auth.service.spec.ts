import { BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InMemoryUsersRepository } from '../users/repositories/implementations/in-memory/in-memory-users-repository';
import { AuthService } from './auth.service';
import { InvalidPasswordOrEmailError } from './errors/invalid-password-or-email.error';

describe('AuthService', () => {
  let repository: InMemoryUsersRepository;
  let service: AuthService;

  beforeEach(async () => {
    /* const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useClass: InMemoryUsersRepository,
        },
      ],
    }).compile(); */

    /* service = module.get<AuthService>(AuthService); */

    repository = new InMemoryUsersRepository();
    service = new AuthService(repository);
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
