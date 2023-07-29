import { File } from '@v1/common/value-objects/file';

export abstract class FileUploaderAdapter {
  abstract upload(file: File): Promise<{ fileName: string }>;
}
