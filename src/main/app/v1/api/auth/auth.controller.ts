import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UserDTO } from '../users/dtos/user.dto';
import { UserMapper } from '../users/mappers/user.mapper';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RegisterRequestDTO } from './dtos/register-request.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './models/auth-user.mode';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Cria um novo usuário
   */
  @Post('/register')
  @ApiResponseDTO(UserDTO)
  async register(
    @Body() register: RegisterRequestDTO,
  ): Promise<ResponseDTO<UserDTO>> {
    const registeredUser = await this.authService.registerUser({
      email: register.email,
      name: register.name,
      password: register.password,
    });

    return UserMapper.toHttp(registeredUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() currentUser: AuthUser) {
    return currentUser; // TODO: retornar o token do usuário
  }
}
