import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaUsersRepository } from '../users/repositories/implementations/prisma/prisma-users-repository';
import { UsersRepository } from '../users/repositories/users-repository';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    LocalStrategy,
  ],
})
export class AuthModule {}
