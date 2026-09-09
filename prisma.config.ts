import 'dotenv/config';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import { definePrismaConfig } from 'prisma/config';

export default definePrismaConfig({
  orm: ormConfig({
    contract: './src/prisma/contract.ts',
    output: './src/prisma/',
    migrations: {
      dir: './src/prisma/migrations',
    },
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
