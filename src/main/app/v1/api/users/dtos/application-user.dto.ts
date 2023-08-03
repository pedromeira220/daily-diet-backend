import { IsEmail, IsString, IsUUID } from 'class-validator';

interface ApplicationUserDTOProps {
  id: string;
  name: string;
  email: string;
  avatarId: string | null;
}

export class ApplicationUserDTO implements ApplicationUserDTOProps {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsUUID()
  avatarId: string | null;

  constructor({ avatarId, email, id, name }: ApplicationUserDTOProps) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.avatarId = avatarId;
  }
}
