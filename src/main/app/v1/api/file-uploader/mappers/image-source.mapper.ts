import { ImageSource as ImageSourceRaw } from '@prisma/client';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { ImageSourceDTO } from '../dtos/image-source.dto';
import { ImageSource, Origin } from '../entities/image-source.entity';

export class ImageSourceMapper {
  static toHttp(imageSource: ImageSource): ResponseDTO<ImageSourceDTO> {
    return new ResponseDTO({ data: this.toDTO(imageSource) });
  }

  static toDTO(imageSource: ImageSource): ImageSourceDTO {
    return new ImageSourceDTO({
      fileName: imageSource.fileName,
      id: imageSource.id.toString(),
      src: imageSource.src,
      origin: imageSource.origin,
    });
  }

  static toPrisma(imageSource: ImageSource): ImageSourceRaw {
    return {
      file_name: imageSource.fileName,
      id: imageSource.id.toString(),
      src: imageSource.src,
      origin: imageSource.origin,
    };
  }

  static fromDTOToDomain(dto: ImageSourceDTO): ImageSource {
    return ImageSource.create(
      {
        fileName: dto.fileName,
        src: dto.src,
        origin: dto.origin,
      },
      new UniqueEntityId(dto.id),
    );
  }

  static fromPrismaToDomain(raw: ImageSourceRaw): ImageSource {
    let origin: Origin = Origin.LOCAL;

    switch (raw.origin) {
      case 'AWS_S3':
        origin = Origin.AWS_S3;
        break;
      case 'LOCAL':
        origin = Origin.LOCAL;
        break;
      default:
        origin = Origin.LOCAL;
    }

    return ImageSource.create(
      {
        fileName: raw.file_name,
        src: raw.src,
        origin,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
