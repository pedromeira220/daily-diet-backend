import { File } from '@v1/common/value-objects/file';
import { ImageSource } from '../entities/image-source.entity';

export abstract class FileUploaderAdapter {
  abstract upload(file: File): Promise<ImageSource>;
}
