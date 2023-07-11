import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@v1/api/auth/auth.module';

import { AllExceptionFilter } from '@v1/common/filters/all-exception.filter';

import { MealsModule } from './api/meals/meals.module';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [UsersModule, AuthModule, MealsModule, DatabaseModule],
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
export class V1Module {}
