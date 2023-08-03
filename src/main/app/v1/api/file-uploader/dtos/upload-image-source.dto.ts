import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Origin } from '../entities/image-source.entity';

export class UploadImageSourceDTO {
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

  @IsString()
  @IsOptional()
  origin: Origin;
}
