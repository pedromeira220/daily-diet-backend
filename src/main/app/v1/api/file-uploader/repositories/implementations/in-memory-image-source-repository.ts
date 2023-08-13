import { Injectable } from '@nestjs/common';
import { ImageSource } from '../../entities/image-source.entity';
import { ImageSourceRepository } from '../image-source.repository';

@Injectable()
export class InMemoryImageSourceRepository implements ImageSourceRepository {
  public itens: ImageSource[] = [];

  async create(imageSource: ImageSource): Promise<void> {
    this.itens.push(imageSource);
  }

  async getById(id: string): Promise<ImageSource | null> {
    const imageSourceFound = this.itens.find(
      (imageSource) => imageSource.id.toString() == id,
    );

    if (!imageSourceFound) {
      return null;
    }

    return imageSourceFound;
  }
}
