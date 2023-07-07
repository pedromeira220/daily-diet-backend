import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dtos/register-request.dto';
import { UserDTO } from '../users/dtos/user.dto';
import { UserViewModel } from '../users/view-models/user-view-model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Cria um novo usuário
   */
  @Post('/register')
  async register(@Body() register: RegisterRequestDTO): Promise<UserDTO> {
    const registeredUser = await this.authService.registerUser({
      email: register.email,
      name: register.name,
      password: register.password,
    });

    return UserViewModel.toDTO(registeredUser);
  }
}
