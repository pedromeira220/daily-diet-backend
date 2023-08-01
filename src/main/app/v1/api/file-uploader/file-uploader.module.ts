import { Module } from '@nestjs/common';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';
import { InMemoryFileUploaderAdapter } from './adapters/implementations/in-memory-file-uploader.adapter';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';
import { ImageSourceRepository } from './repositories/image-source.repository';
import { PrismaImageSourceRepository } from './repositories/implementations/prisma-image-source-repository';

@Module({
  controllers: [FileUploaderController],
  providers: [
    FileUploaderService,
    {
      provide: FileUploaderAdapter,
      useClass: InMemoryFileUploaderAdapter,
    },
    {
      provide: ImageSourceRepository,
      useClass: PrismaImageSourceRepository,
    },
  ],
})
export class FileUploaderModule {}
