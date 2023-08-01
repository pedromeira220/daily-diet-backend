import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { makeUser } from '@test/factories/make-user';
import { uploadImage } from '@test/utils/upload-image';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { FileUploaderAdapter } from '../file-uploader/adapters/file-uploader.adpater';
import { InMemoryFileUploaderAdapter } from '../file-uploader/adapters/implementations/in-memory-file-uploader.adapter';
import { FileUploaderService } from '../file-uploader/file-uploader.service';
import { ImageSourceRepository } from '../file-uploader/repositories/image-source.repository';
import { InMemoryImageSourceRepository } from '../file-uploader/repositories/implementations/in-memory-image-source-repository';
import { InMemoryUsersRepository } from './repositories/implementations/in-memory/in-memory-users-repository';
import { UsersRepository } from './repositories/users-repository';
import { UsersService } from './users.service';
// import { UsersRepository } from './repositories/users-repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: InMemoryUsersRepository;
  let fileUploaderService: FileUploaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: InMemoryUsersRepository,
        },
        FileUploaderService,
        {
          provide: ImageSourceRepository,
          useClass: InMemoryImageSourceRepository,
        },
        {
          provide: FileUploaderAdapter,
          useClass: InMemoryFileUploaderAdapter,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<InMemoryUsersRepository>(UsersRepository);
    fileUploaderService = module.get<FileUploaderService>(FileUploaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get an user by id', async () => {
    const userId = new UniqueEntityId();

    const previousCreatedUser = makeUser({}, userId);

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

  it('should be able to update an user', async () => {
    const userId = new UniqueEntityId();

    const previousCreatedUser = makeUser({}, userId);

    repository.users.push(previousCreatedUser);

    const { imageSource, removeFromDiscUploadedFile } = await uploadImage(
      fileUploaderService,
    );

    const userFound = await service.updateById({
      userId: userId.toString(),
      name: 'Updated name',
      avatar: imageSource,
    });

    expect(userFound).toBeDefined();
    expect(userFound.id.toString()).toBe(userId.toString());
    expect(userFound.name).toBe('Updated name');

    removeFromDiscUploadedFile();
  });
});
