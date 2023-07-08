import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from '../users/repositories/implementations/in-memory/in-memory-users-repository';
import { UsersRepository } from '../users/repositories/users-repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
