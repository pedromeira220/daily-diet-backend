import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UserDTO } from './dtos/user.dto';
import { UsersService } from './users.service';
import { UserViewModel } from './view-models/user-view-model';

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

    return UserViewModel.toHttp(userFound);
  }
}
