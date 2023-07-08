import { BadRequestException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InMemoryUsersRepository } from '../users/repositories/implementations/in-memory/in-memory-users-repository';
import { AuthService } from './auth.service';

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
});
