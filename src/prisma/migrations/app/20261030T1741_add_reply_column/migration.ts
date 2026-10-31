#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/11c287e5f580ea9812cf1322bee0b4af234bf5da6d4d8a605e9dc980b8209911/contract';
import endContract from '../../snapshots/11c287e5f580ea9812cf1322bee0b4af234bf5da6d4d8a605e9dc980b8209911/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/cd5980956196466df9baf721e769c3010299f85c7cf23c5dec5ecb6833f27f95/contract';
import startContract from '../../snapshots/cd5980956196466df9baf721e769c3010299f85c7cf23c5dec5ecb6833f27f95/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Ticket',
        column: col('reply', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
