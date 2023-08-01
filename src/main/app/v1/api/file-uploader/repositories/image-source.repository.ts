import { ImageSource } from '../entities/image-source.entity';

export abstract class ImageSourceRepository {
  abstract create(imageSource: ImageSource): Promise<void>;
}
