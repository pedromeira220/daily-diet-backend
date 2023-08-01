import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

interface ImageSourceProps {
  src: string;
  fileName: string;
}

export class ImageSource extends Entity<ImageSourceProps> {
  private static uriPath = '/file-uploader/image/';

  get src() {
    return this.props.src;
  }

  get fileName() {
    return this.props.fileName;
  }

  static create(props: Optional<ImageSourceProps, 'src'>, id?: UniqueEntityId) {
    return new ImageSource(
      {
        ...props,
        src: props.src ?? this.createSrcFromFileName(props.fileName),
      },
      id,
    );
  }

  static createSrcFromFileName(fileName: string) {
    return this.uriPath.concat(fileName);
  }
}
