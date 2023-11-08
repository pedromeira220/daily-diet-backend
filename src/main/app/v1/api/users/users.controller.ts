import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/models/auth-user.model';
import { ImageSourceMapper } from '../file-uploader/mappers/image-source.mapper';
import { ApplicationUserDTO } from './dtos/application-user.dto';
import { ProfileDTO } from './dtos/profile.dto';
import { UpdateApplicationUserDTO } from './dtos/update-application-user.dto';
import { ProfileMapper } from './mappers/profile.mapper';
import { UserMapper } from './mappers/user.mapper';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /**
   * Busca os dados de um usuário pelo id
   */
  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const userFound = await this.usersService.getById(userId);

    return UserMapper.toHttp(userFound);
  }

  @Get('/')
  async getLoggedUser(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<ApplicationUserDTO>> {
    const userFound = await this.usersService.getById(currentUser.userId);

    return UserMapper.toHttp(userFound);
  }

  @Put('/')
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

  @Get('profile/me')
  async getProfile(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<ProfileDTO>> {
    const profile = await this.usersService.getProfile({
      userId: currentUser.userId,
    });

    return ProfileMapper.toHttp(profile);
  }

  @Get('/hello/world')
  async getHelloWorld() {
    return 'Hello world';
  }
}
