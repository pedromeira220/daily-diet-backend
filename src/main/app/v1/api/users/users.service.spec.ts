import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { InMemoryUsersRepository } from './repositories/implementations/in-memory/in-memory-users-repository';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users-repository';
// import { UsersRepository } from './repositories/users-repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: InMemoryUsersRepository;

  beforeEach(async () => {
    /* const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: InMemoryUsersRepository,
        },
      ],
    }).compile(); */

    // service = module.get<UsersService>(UsersService);
    repository = new InMemoryUsersRepository();
    service = new UsersService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get an user by id', async () => {
    const userId = new UniqueEntityId();

    const previousCreatedUser = User.create(
      {
        email: 'john@example.com',
        name: 'John Doe',
        password: '1234',
      },
      userId,
    );

    repository.users.push(previousCreatedUser);

    const userFound = await service.getById(userId.toString());

    expect(userFound).toBeDefined();
    expect(userFound.id.toString()).toBe(userId.toString());
  });

  it('should not be able to get an user that does not exists', async () => {
    expect(async () => {
      await service.getById('fake-user-id');
    }).rejects.toThrowError(NotFoundException);
  });
});
