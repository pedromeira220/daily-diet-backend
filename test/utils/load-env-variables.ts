import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.testing' });

export const loadEnvVariables = () => {
  console.log('> Env variables loaded');
};
