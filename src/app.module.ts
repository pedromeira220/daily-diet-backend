import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './main/app/v1/api/users/users.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@v1/api/auth/auth.module';

import { AllExceptionFilter } from '@v1/common/filters/all-exception.filter';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
