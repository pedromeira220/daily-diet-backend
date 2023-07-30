import { Test, TestingModule } from '@nestjs/testing';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';
import { InMemoryFileUploaderAdapter } from './adapters/implementations/in-memory-file-uploader.adapter';
import { FileUploaderService } from './file-uploader.service';

describe('FileUploaderService', () => {
  let service: FileUploaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploaderService,
        {
          provide: FileUploaderAdapter,
          useClass: InMemoryFileUploaderAdapter,
        },
      ],
    }).compile();

    service = module.get<FileUploaderService>(FileUploaderService);
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

    rmSync(uploadedImagePath);
  });
});
