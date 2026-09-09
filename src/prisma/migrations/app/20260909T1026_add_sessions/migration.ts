#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1fe52f4491cfaf0f6ba85e90dc2704ee0d6e89a9a791264f2eaf06eaa2a51bc6/contract';
import endContract from '../../snapshots/1fe52f4491cfaf0f6ba85e90dc2704ee0d6e89a9a791264f2eaf06eaa2a51bc6/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a35029a74f99efd24d589ff09c42cf76863dca8254e0ec61cd0eae8ab8a61636/contract';
import startContract from '../../snapshots/a35029a74f99efd24d589ff09c42cf76863dca8254e0ec61cd0eae8ab8a61636/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Session',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('revokedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Session',
        constraint: 'Session_tokenHash_key',
        columns: ['tokenHash'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
