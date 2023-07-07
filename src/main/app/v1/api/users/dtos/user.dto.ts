import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}
