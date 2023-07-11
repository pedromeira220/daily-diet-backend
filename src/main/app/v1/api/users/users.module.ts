import { Module } from '@nestjs/common';
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
  ],
})
export class UsersModule {}
