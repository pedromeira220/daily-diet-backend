import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from '../users/repositories/users-repository';
import { InMemoryUsersRepository } from '../users/repositories/implementations/in-memory/in-memory-users-repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: UsersRepository,
      useClass: InMemoryUsersRepository,
    },
  ],
})
export class AuthModule {}
