import { ImageSource as ImageSourceRaw } from '@prisma/client';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { ImageSourceDTO } from '../dtos/image-source.dto';
import { ImageSource } from '../entities/image-source.entity';

export class ImageSourceMapper {
  static toHttp(imageSource: ImageSource): ResponseDTO<ImageSourceDTO> {
    return new ResponseDTO({ data: this.toDTO(imageSource) });
  }

  static toDTO(imageSource: ImageSource): ImageSourceDTO {
    return new ImageSourceDTO({
      fileName: imageSource.fileName,
      id: imageSource.id.toString(),
      src: imageSource.src,
    });
  }

  static toPrisma(imageSource: ImageSource): ImageSourceRaw {
    return {
      file_name: imageSource.fileName,
      id: imageSource.id.toString(),
      src: imageSource.src,
    };
  }

  static fromDTOToDomain(dto: ImageSourceDTO): ImageSource {
    return ImageSource.create(
      {
        fileName: dto.fileName,
        src: dto.src,
      },
      new UniqueEntityId(dto.id),
    );
  }

  static fromPrismaToDomain(raw: ImageSourceRaw): ImageSource {
    return ImageSource.create(
      {
        fileName: raw.file_name,
        src: raw.src,
      },
      new UniqueEntityId(raw.id),
    );
  }
}
