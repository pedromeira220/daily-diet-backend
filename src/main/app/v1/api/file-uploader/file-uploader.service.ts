import { Injectable, NotFoundException } from '@nestjs/common';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';
import { ImageSource } from './entities/image-source.entity';
import { ImageSourceRepository } from './repositories/image-source.repository';

@Injectable()
export class FileUploaderService {
  constructor(
    private fileUploaderAdapter: FileUploaderAdapter,
    private imageSourceRepository: ImageSourceRepository,
  ) {}

  async upload(file: File): Promise<ImageSource> {
    const { fileName } = await this.fileUploaderAdapter.upload(file);

    const imageSource = ImageSource.create({
      fileName,
    });

    await this.imageSourceRepository.create(imageSource);

    return imageSource;
  }

  async getFile(fileName: string) {
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

    const filePath = new Path(uploadDir, fileName);

    if (!existsSync(filePath.toString())) {
      throw new NotFoundException('File not found');
    }

    return { file: File.fromPath(filePath) };
  }
}
