import { UnauthorizedException } from '@nestjs/common';

export class InvalidPasswordOrEmailError extends UnauthorizedException {
  constructor() {
    super('Email ou senha incorretos');
  }
}
