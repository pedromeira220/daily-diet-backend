import { ImageSource as ImageSourceRaw } from '@prisma/client';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
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
}
