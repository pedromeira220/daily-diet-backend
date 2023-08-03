import { File } from '@v1/common/value-objects/file';
import { randomUUID } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { ImageSource, Origin } from '../../entities/image-source.entity';
import { FileUploaderAdapter } from '../file-uploader.adpater';

export class InMemoryFileUploaderAdapter implements FileUploaderAdapter {
  async upload(file: File): Promise<ImageSource> {
    const fileId = randomUUID();
    const extension = extname(file.originalname);

    const fileName = fileId.concat(extension);

    const uploadDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
    );

    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir);
    }

    const filePath = join(uploadDir, fileName);

    const writeStream = createWriteStream(filePath);

    return new Promise((resolve) => {
      writeStream.write(file.buffer, (error) => {
        if (error) {
          if (error instanceof Error) {
            throw error;
          }

          throw new Error('> Error while trying to save image');
        }
        resolve(
          ImageSource.create({
            fileName,
            origin: Origin.LOCAL,
          }),
        );
      });
    });
  }
}
