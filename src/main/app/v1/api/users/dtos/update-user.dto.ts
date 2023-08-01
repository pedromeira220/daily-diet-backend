import { CreateImageSourceDTO } from '@v1/api/file-uploader/dtos/create-image-source.dto';
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ValidateNested()
  @IsOptional()
  avatar?: CreateImageSourceDTO;
}
