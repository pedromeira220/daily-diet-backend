import { Module } from '@nestjs/common';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';
import { InMemoryFileUploaderAdapter } from './adapters/implementations/in-memory-file-uploader.adapter';
import { FileUploaderController } from './file-uploader.controller';
import { FileUploaderService } from './file-uploader.service';

@Module({
  controllers: [FileUploaderController],
  providers: [
    FileUploaderService,
    {
      provide: FileUploaderAdapter,
      useClass: InMemoryFileUploaderAdapter,
    },
  ],
})
export class FileUploaderModule {}
