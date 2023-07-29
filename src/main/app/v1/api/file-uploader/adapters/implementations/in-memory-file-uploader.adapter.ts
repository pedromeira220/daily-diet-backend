import { randomUUID } from 'node:crypto';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { FileUploaderAdapter } from '../file-uploader.adpater';

export class InMemoryFileUploaderAdapter implements FileUploaderAdapter {
  async upload(file: Express.Multer.File): Promise<{ fileName: string }> {
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

    console.log('> chegou aqui');

    return new Promise((resolve) => {
      writeStream.write(file.buffer, (error) => {
        if (error) {
          if (error instanceof Error) {
            throw error;
          }

          throw new Error('> Error while trying to save image');
        }
        resolve({ fileName });
      });
    });
  }
}
