#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/5a37e5caa33a2adf5b62847852d083cde3306e2cb28fa4768bef4cae7ba0ee16/contract';
import startContract from '../../snapshots/5a37e5caa33a2adf5b62847852d083cde3306e2cb28fa4768bef4cae7ba0ee16/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/81fe4b7e3f5a9427dad0cb148aa1a32380a8fff6841604804fa69e939cfb16c1/contract';
import endContract from '../../snapshots/81fe4b7e3f5a9427dad0cb148aa1a32380a8fff6841604804fa69e939cfb16c1/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, placeholder } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Ticket', column: 'resolvedBy' }),
      this.addColumn({
        schema: 'public',
        table: 'Ticket',
        column: col('assignedTo', 'character(36)', {
          codecRef: { codecId: 'sql/char@1', typeParams: { length: 36 } },
        }),
      }),
      this.dataTransform(endContract, 'backfill-Ticket-assignedTo', {
        check: () => placeholder('backfill-Ticket-assignedTo:check'),
        run: () => placeholder('backfill-Ticket-assignedTo:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'Ticket', column: 'assignedTo' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-password', {
        check: () => placeholder('backfill-User-password:check'),
        run: () => placeholder('backfill-User-password:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'password' }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('username', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.dataTransform(endContract, 'backfill-User-username', {
        check: () => placeholder('backfill-User-username:check'),
        run: () => placeholder('backfill-User-username:run'),
      }),
      this.setNotNull({ schema: 'public', table: 'User', column: 'username' }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_username_key',
        columns: ['username'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
