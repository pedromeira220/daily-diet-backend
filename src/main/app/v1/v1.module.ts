import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@v1/api/auth/auth.module';

import { AllExceptionFilter } from '@v1/common/filters/all-exception.filter';

import { JwtAuthGuard } from './api/auth/guards/jwt-auth.guard';
import { FileUploaderModule } from './api/file-uploader/file-uploader.module';
// import { ImagesModule } from './api/images/images.module';
import { MealsModule } from './api/meals/meals.module';
import { UsersModule } from './api/users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MealsModule,
    DatabaseModule,
    FileUploaderModule,
    // ImagesModule,
  ],
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
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class V1Module {}
