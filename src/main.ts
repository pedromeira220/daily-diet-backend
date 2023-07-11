import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from 'src/main/app/core/config/app-config.service';
import { AppModule } from './main/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvConfigService);

  const PORT = envService.PORT;

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Daily diet api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT).then(() => {
    console.log(`Server running on port: ${PORT}`);
  });
}
bootstrap();
