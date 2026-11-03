#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/11c287e5f580ea9812cf1322bee0b4af234bf5da6d4d8a605e9dc980b8209911/contract';
import startContract from '../../snapshots/11c287e5f580ea9812cf1322bee0b4af234bf5da6d4d8a605e9dc980b8209911/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/85138edd643b5b49c634e92de186720a4bf24394be104855c047822035776d27/contract';
import endContract from '../../snapshots/85138edd643b5b49c634e92de186720a4bf24394be104855c047822035776d27/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Ticket', column: 'reply' }),
      this.createTable({
        schema: 'public',
        table: 'Reply',
        columns: [
          col('authorId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
          col('message', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ticketId', 'character(36)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
