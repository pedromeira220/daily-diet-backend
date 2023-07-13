import { IsString } from 'class-validator';

interface TokenResponseDTOProps {
  token: string;
}

export class TokenResponseDTO implements TokenResponseDTOProps {
  @IsString()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
