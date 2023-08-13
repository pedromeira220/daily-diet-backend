import { ImageSourceDTO } from '@v1/api/file-uploader/dtos/image-source.dto';
import { IsEmail, IsString, IsUUID } from 'class-validator';

interface ProfileDTOProps {
  id: string;
  name: string;
  email: string;
  avatar: ImageSourceDTO | null;
}

export class ProfileDTO implements ProfileDTOProps {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  avatar: ImageSourceDTO | null;

  constructor({ avatar, email, id, name }: ProfileDTOProps) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.avatar = avatar;
  }
}
