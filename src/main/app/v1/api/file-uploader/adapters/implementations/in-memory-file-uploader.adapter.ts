import { randomUUID } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { extname, join } from 'node:path';
import { FileUploaderAdapter } from '../file-uploader.adpater';

export class InMemoryFileUploaderAdapter implements FileUploaderAdapter {
  async upload(file: Express.Multer.File): Promise<void> {
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
      'uploads',
    );

    const filePath = join(uploadDir, fileName);

    const writeStream = createWriteStream(filePath);

    return new Promise((resolve) => {
      writeStream.write(file.buffer, (error) => {
        if (error) {
          if (error instanceof Error) {
            throw error;
          }

          throw new Error('> Error while trying to save image');
        } else {
          resolve();
        }
      });
    });
  }
}
