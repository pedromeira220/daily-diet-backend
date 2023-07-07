import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './main/app/v1/api/users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@v1/api/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
