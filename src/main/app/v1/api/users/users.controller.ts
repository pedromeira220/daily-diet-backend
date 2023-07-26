import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/models/auth-user.model';
import { UserDTO } from './dtos/user.dto';
import { UserMapper } from './mappers/user.mapper';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Busca os dados de um usuário pelo id
   */
  @Get(':id')
  @ApiResponseDTO(UserDTO)
  async getById(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<ResponseDTO<UserDTO>> {
    const userFound = await this.usersService.getById(userId);

    return UserMapper.toHttp(userFound);
  }

  @Get('/')
  async getLoggedUser(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<UserDTO>> {
    const userFound = await this.usersService.getById(currentUser.userId);

    return UserMapper.toHttp(userFound);
  }
}
