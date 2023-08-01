import { Module } from '@nestjs/common';
import { ImageSourceRepository } from '../file-uploader/repositories/image-source.repository';
import { PrismaImageSourceRepository } from '../file-uploader/repositories/implementations/prisma-image-source-repository';
import { PrismaUsersRepository } from './repositories/implementations/prisma/prisma-users-repository';
import { UsersRepository } from './repositories/users-repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ImageSourceRepository,
      useClass: PrismaImageSourceRepository,
    },
  ],
})
export class UsersModule {}
