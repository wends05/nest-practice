#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1f99dd249414f49b1d63bee9fef4cabdba9bec72d1d757dbc6b22068a8524511/contract';
import endContract from '../../snapshots/1f99dd249414f49b1d63bee9fef4cabdba9bec72d1d757dbc6b22068a8524511/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/85138edd643b5b49c634e92de186720a4bf24394be104855c047822035776d27/contract';
import startContract from '../../snapshots/85138edd643b5b49c634e92de186720a4bf24394be104855c047822035776d27/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, rawSql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      // The planner can't rename enum values. Renaming in place keeps every
      // CLOSED ticket, which becomes RESOLVED.
      rawSql({
        id: 'renameNativeEnumValue.TICKET_STATUS.CLOSED',
        label: 'Rename enum value "CLOSED" to "RESOLVED" on "TICKET_STATUS"',
        operationClass: 'data',
        target: {
          id: 'postgres',
          details: { schema: 'public', objectType: 'type', name: 'TICKET_STATUS' },
        },
        precheck: [],
        execute: [
          {
            description: 'rename enum value "CLOSED" to "RESOLVED"',
            sql: `ALTER TYPE "public"."TICKET_STATUS" RENAME VALUE 'CLOSED' TO 'RESOLVED'`,
            params: [],
          },
        ],
        postcheck: [],
      }),
      this.addNativeEnumValue({
        schema: 'public',
        typeName: 'TICKET_STATUS',
        value: 'DECLINED',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
