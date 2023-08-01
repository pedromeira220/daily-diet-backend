import { FileUploaderService } from '@v1/api/file-uploader/file-uploader.service';
import { File } from '@v1/common/value-objects/file';
import { Path } from '@v1/common/value-objects/path';
import { rmSync } from 'node:fs';
import { join } from 'node:path';

export const uploadImage = async (service: FileUploaderService) => {
  const imagePath = new Path(__dirname, '..', 'images', 'test-image.png');

  const imageSource = await service.upload(File.fromPath(imagePath));

  const uploadDir = join(__dirname, '..', '..', 'uploads');

  const uploadedImagePath = join(uploadDir, imageSource.fileName);

  const removeFromDiscUploadedFile = () => {
    rmSync(uploadedImagePath);
  };

  return {
    uploadedImagePath,
    imageSource,
    uploadDir,
    removeFromDiscUploadedFile,
  };
};
