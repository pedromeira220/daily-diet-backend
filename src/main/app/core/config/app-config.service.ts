import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvironment } from './env.validation';

@Global()
@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get NODE_ENV(): NodeEnvironment {
    return this.configService.get('NODE_ENV') as NodeEnvironment;
  }

  get PORT(): number {
    return Number(this.configService.get('PORT'));
  }

  get isDevEnvironment(): boolean {
    return this.NODE_ENV === NodeEnvironment.Development;
  }

  get isTestEnvironment(): boolean {
    return this.NODE_ENV === NodeEnvironment.Test;
  }

  get isProductionEnvironment(): boolean {
    return this.NODE_ENV === NodeEnvironment.Production;
  }

  get isProvisionEnvironment(): boolean {
    return this.NODE_ENV === NodeEnvironment.Provision;
  }

  get AWS_S3_BUCKET(): string {
    return this.configService.get('AWS_S3_BUCKET') as string;
  }

  get AWS_ACCESS_KEY_ID(): string {
    return this.configService.get('AWS_ACCESS_KEY_ID') as string;
  }

  get AWS_SECRET_ACCESS_KEY(): string {
    return this.configService.get('AWS_SECRET_ACCESS_KEY') as string;
  }
}
