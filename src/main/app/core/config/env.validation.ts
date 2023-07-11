import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  @IsNumber()
  PORT: number;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error('❌ Invalid environment variables', errors.toString());

    throw new Error('Invalid environment variables');
  }

  return validatedConfig;
};
