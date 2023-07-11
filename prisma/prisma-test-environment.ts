import type {
  EnvironmentContext,
  JestEnvironmentConfig,
} from '@jest/environment';
import * as dotenv from 'dotenv';
import { TestEnvironment } from 'jest-environment-node';
import { exec } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { Client } from 'pg';

dotenv.config({ path: '.env.testing' });

const execSync = promisify(exec);

const prismaBinary = './node_modules/.bin/prisma';

export default class PrismaTestEnvironment extends TestEnvironment {
  private schema: string;
  private connectionString: string;

  constructor(config: JestEnvironmentConfig, _context: EnvironmentContext) {
    super(config, _context);

    const dbUser = process.env.PG_DB_USER;
    const dbPass = process.env.PG_DB_PASSWORD;
    const dbHost = process.env.PG_DB_HOST;
    const dbPort = process.env.PG_DB_PORT;
    const dbName = process.env.PG_DB_DB;

    this.schema = `test_${randomUUID()}`;
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await execSync(`${prismaBinary} migrate deploy`);

    return super.setup();
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    });

    await client.connect();
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`);
    await client.end();
  }
}
