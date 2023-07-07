import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDTO {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;
}
