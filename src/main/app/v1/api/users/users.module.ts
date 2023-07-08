import { Module } from '@nestjs/common';
import { InMemoryUsersRepository } from './repositories/implementations/in-memory/in-memory-users-repository';
import { UsersRepository } from './repositories/users-repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useClass: InMemoryUsersRepository,
    },
  ],
})
export class UsersModule {}
