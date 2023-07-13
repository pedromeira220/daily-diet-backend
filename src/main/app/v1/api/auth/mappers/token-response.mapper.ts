import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { TokenResponseDTO } from '../dtos/token-response.dto';

export class TokenResponseMapper {
  static toHttp(token: string): ResponseDTO<TokenResponseDTO> {
    return new ResponseDTO({ data: this.toDTO(token) });
  }

  static toDTO(token: string): TokenResponseDTO {
    return new TokenResponseDTO(token);
  }
}
