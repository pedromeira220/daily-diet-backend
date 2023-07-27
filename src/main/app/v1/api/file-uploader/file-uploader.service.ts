import { Injectable } from '@nestjs/common';
import { File } from '@v1/common/value-objects/file';
import { FileUploaderAdapter } from './adapters/file-uploader.adpater';

@Injectable()
export class FileUploaderService {
  constructor(private fileUploaderAdapter: FileUploaderAdapter) {}

  async upload(file: File) {
    await this.fileUploaderAdapter.upload(file);
  }
}
