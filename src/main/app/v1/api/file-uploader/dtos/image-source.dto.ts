interface ImageSourceDTOProps {
  id: string;
  fileName: string;
  src: string;
}

export class ImageSourceDTO implements ImageSourceDTOProps {
  id: string;
  fileName: string;
  src: string;

  constructor({ id, fileName, src }: ImageSourceDTO) {
    this.id = id;
    this.fileName = fileName;
    this.src = src;
  }
}
