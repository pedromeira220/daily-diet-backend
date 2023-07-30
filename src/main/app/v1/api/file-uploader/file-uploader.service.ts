import { Injectable, NotFoundException } from '@nestjs/common';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';

@Injectable()
export class FileUploaderService {
  constructor(private fileUploaderAdapter: FileUploaderAdapter) {}

  async upload(file: File) {
    return await this.fileUploaderAdapter.upload(file);
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
