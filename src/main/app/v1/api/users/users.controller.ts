import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from './dtos/user.dto';
import { UserViewModel } from './view-models/user-view-model';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe()) userId: string,
  ): Promise<UserDTO> {
    const userFound = await this.usersService.getById(userId);

    return UserViewModel.toDTO(userFound);
  }
}
