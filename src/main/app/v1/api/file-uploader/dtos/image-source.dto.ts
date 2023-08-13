import { Origin } from './../entities/image-source.entity';
interface ImageSourceDTOProps {
  id: string;
  fileName: string;
  src: string;
  origin: Origin;
}

export class ImageSourceDTO implements ImageSourceDTOProps {
  id: string;
  fileName: string;
  src: string;
  origin: Origin;

  constructor({ id, fileName, src, origin }: ImageSourceDTO) {
    this.id = id;
    this.fileName = fileName;
    this.src = src;
    this.origin = origin;
  }
}
