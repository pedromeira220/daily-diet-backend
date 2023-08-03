import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/models/auth-user.model';
import { ImageSourceMapper } from '../file-uploader/mappers/image-source.mapper';
import { ApplicationUserDTO } from './dtos/application-user.dto';
import { UpdateApplicationUserDTO } from './dtos/update-application-user.dto';
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
  @ApiResponseDTO(ApplicationUserDTO)
  async getById(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const userFound = await this.usersService.getById(userId);

    return UserMapper.toHttp(userFound);
  }

  @Get('/')
  @ApiResponseDTO(ApplicationUserDTO)
  async getLoggedUser(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const userFound = await this.usersService.getById(currentUser.userId);

    return UserMapper.toHttp(userFound);
  }

  @Put('/')
  @ApiResponseDTO(ApplicationUserDTO)
  async update(
    @CurrentUser() currentUser: AuthUser,
    @Body() dto: UpdateApplicationUserDTO,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const updatedUser = await this.usersService.updateById({
      userId: currentUser.userId,
      avatar: !!dto.avatar
        ? ImageSourceMapper.fromDTOToDomain(dto.avatar)
        : null,
      name: dto.name,
    });

    return UserMapper.toHttp(updatedUser);
  }
}
