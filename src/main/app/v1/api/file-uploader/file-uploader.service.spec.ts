import { Test, TestingModule } from '@nestjs/testing';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';
import { InMemoryFileUploaderAdapter } from './adapters/implementations/in-memory-file-uploader.adapter';
import { FileUploaderService } from './file-uploader.service';
import { ImageSourceRepository } from './repositories/image-source.repository';
import { InMemoryImageSourceRepository } from './repositories/implementations/in-memory-image-source-repository';

describe('FileUploaderService', () => {
  let service: FileUploaderService;
  let repository: InMemoryImageSourceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploaderService,
        {
          provide: FileUploaderAdapter,
          useClass: InMemoryFileUploaderAdapter,
        },
        {
          provide: ImageSourceRepository,
          useClass: InMemoryImageSourceRepository,
        },
      ],
    }).compile();

    service = module.get<FileUploaderService>(FileUploaderService);
    repository = module.get<InMemoryImageSourceRepository>(
      ImageSourceRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to upload an image', async () => {
    const imagePath = new Path(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'test',
      'images',
      'test-image.png',
    );

    const { fileName } = await service.upload(File.fromPath(imagePath));

    const uploadDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
    );

    const uploadedImagePath = join(uploadDir, fileName);

    const imageExists = existsSync(join(uploadDir, fileName));

    expect(imageExists).toBeTruthy();
    expect(repository.itens).toHaveLength(1);

    rmSync(uploadedImagePath);
  });
});
