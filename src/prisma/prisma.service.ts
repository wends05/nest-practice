import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnApplicationShutdown {
  readonly db = db;

  async onApplicationShutdown() {
    await this.db.close();
  }
}
