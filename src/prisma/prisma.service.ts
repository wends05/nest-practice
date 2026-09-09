import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class PrismaService implements OnApplicationShutdown {
  readonly db = db;

  async onApplicationShutdown() {
    await this.db.close();
  }
}
