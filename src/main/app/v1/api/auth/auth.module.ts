import { Module } from '@nestjs/common';
import { PrismaUsersRepository } from '../users/repositories/implementations/prisma/prisma-users-repository';
import { UsersRepository } from '../users/repositories/users-repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
})
export class AuthModule {}
