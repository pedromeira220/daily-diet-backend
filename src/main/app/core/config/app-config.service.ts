import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvironment } from './env.validation';

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
}
