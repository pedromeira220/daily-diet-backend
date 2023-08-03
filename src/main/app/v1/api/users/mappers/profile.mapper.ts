import { ImageSourceMapper } from '@v1/api/file-uploader/mappers/image-source.mapper';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { ProfileDTO } from '../dtos/profile.dto';
import { Profile } from '../entities/profile.entity';

export class ProfileMapper {
  static toHttp(profile: Profile): ResponseDTO<ProfileDTO> {
    return new ResponseDTO({ data: this.toDTO(profile) });
  }

  static toDTO(profile: Profile): ProfileDTO {
    return new ProfileDTO({
      avatar: !!profile.avatar ? ImageSourceMapper.toDTO(profile.avatar) : null,
      email: profile.email,
      id: profile.id.toString(),
      name: profile.name,
    });
  }
}
