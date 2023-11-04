import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvConfigService } from 'src/main/app/core/config/app-config.service';
import { AppModule } from './main/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const envService = app.get(EnvConfigService);

  const PORT = envService.PORT;

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(PORT).then(() => {
    console.log(`Server running on port: ${PORT}`);
  });
}
bootstrap();
