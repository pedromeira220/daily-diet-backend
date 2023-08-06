import { FileUploaderService } from '@v1/api/file-uploader/file-uploader.service';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';

export const uploadImage = async (service: FileUploaderService) => {
  const imagePath = new Path(__dirname, '..', 'images', 'test-image.png');

  const imageSource = await service.upload(File.fromPath(imagePath));

  return {
    imageSource,
  };
};
