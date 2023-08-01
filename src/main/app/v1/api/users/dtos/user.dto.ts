import { IsEmail, IsString, IsUUID } from 'class-validator';

interface UserDTOProps {
  id: string;
  name: string;
  email: string;
  avatarId: string | null;
}

export class UserDTO implements UserDTOProps {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsUUID()
  avatarId: string | null;

  constructor({ avatarId, email, id, name }: UserDTOProps) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.avatarId = avatarId;
  }
}
