import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { V1Module } from '@v1/v1.module';
import { AppConfigModule } from './core/config/app-config.module';
import { validate } from './core/config/env.validation';

@Module({
  imports: [
    V1Module,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
      expandVariables: true,
    }),
    AppConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
