#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/02dcf1b747f06c819fcbcefeb0a066237b8ee3be6b6305ff536a34d3cdec29b7/contract';
import startContract from '../../snapshots/02dcf1b747f06c819fcbcefeb0a066237b8ee3be6b6305ff536a34d3cdec29b7/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b2f79abb905f416f32032726b16fbb7caada61d5b42ce4126fb97a3dc278ecf0/contract';
import endContract from '../../snapshots/b2f79abb905f416f32032726b16fbb7caada61d5b42ce4126fb97a3dc278ecf0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Ticket',
        column: col('createdAt', 'timestamptz', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
