import { Global, Module } from '@nestjs/common';
import { EnvConfigService } from './app-config.service';

@Global()
@Module({
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class AppConfigModule {}
