import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateImageSourceDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  src: string;
}
