import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { ApplicationUserDTO } from '../users/dtos/application-user.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { RegisterRequestDTO } from './dtos/register-request.dto';
import { TokenResponseDTO } from './dtos/token-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { TokenResponseMapper } from './mappers/token-response.mapper';
import { AuthUser } from './models/auth-user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Cria um novo usuário
   */
  @Public()
  @Post('/register')
  async register(
    @Body() register: RegisterRequestDTO,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const registeredUser = await this.authService.registerUser({
      email: register.email,
      name: register.name,
      password: register.password,
    });

    return UserMapper.toHttp(registeredUser);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<TokenResponseDTO>> {
    const { access_token } = await this.authService.login(currentUser);

    return TokenResponseMapper.toHttp(access_token);
  }
}
