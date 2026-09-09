#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/81fe4b7e3f5a9427dad0cb148aa1a32380a8fff6841604804fa69e939cfb16c1/contract';
import startContract from '../../snapshots/81fe4b7e3f5a9427dad0cb148aa1a32380a8fff6841604804fa69e939cfb16c1/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a35029a74f99efd24d589ff09c42cf76863dca8254e0ec61cd0eae8ab8a61636/contract';
import endContract from '../../snapshots/a35029a74f99efd24d589ff09c42cf76863dca8254e0ec61cd0eae8ab8a61636/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'User', column: 'password' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-passwordHash', {
        check: () => placeholder('backfill-User-passwordHash:check'),
        run: () => placeholder('backfill-User-passwordHash:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'passwordHash' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
