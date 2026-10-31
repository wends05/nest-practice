#!/usr/bin/env -S node
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';
import type { Contract as Start } from '../../snapshots/b2f79abb905f416f32032726b16fbb7caada61d5b42ce4126fb97a3dc278ecf0/contract';
import startContract from '../../snapshots/b2f79abb905f416f32032726b16fbb7caada61d5b42ce4126fb97a3dc278ecf0/contract.json' with {
  type: 'json',
};
import type { Contract as End } from '../../snapshots/cd5980956196466df9baf721e769c3010299f85c7cf23c5dec5ecb6833f27f95/contract';
import endContract from '../../snapshots/cd5980956196466df9baf721e769c3010299f85c7cf23c5dec5ecb6833f27f95/contract.json' with {
  type: 'json',
};

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'TICKET_STATUS',
        members: ['OPEN', 'ASSIGNED', 'CLOSED'],
      }),
      this.createNativeEnumType({
        schema: 'public',
        typeName: 'USER_ROLE',
        members: ['ADMIN', 'USER'],
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'Ticket',
        constraint: 'Ticket_status_check_3820399c',
      }),
      this.dropCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_5b1978b5',
      }),
      this.dropDefault({
        schema: 'public',
        table: 'Ticket',
        column: 'status',
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'Ticket',
        column: 'status',
        options: {
          qualifiedTargetType: '"TICKET_STATUS"',
          formatTypeExpected: '"TICKET_STATUS"',
          rawTargetTypeForLabel: '"TICKET_STATUS"',
        },
      }),
      this.setDefault({
        schema: 'public',
        table: 'Ticket',
        column: 'status',
        defaultSql: `DEFAULT 'OPEN'::"TICKET_STATUS"`,
      }),
      this.dropDefault({
        schema: 'public',
        table: 'User',
        column: 'role',
      }),
      this.alterColumnType({
        schema: 'public',
        table: 'User',
        column: 'role',
        options: {
          qualifiedTargetType: '"USER_ROLE"',
          formatTypeExpected: '"USER_ROLE"',
          rawTargetTypeForLabel: '"USER_ROLE"',
        },
      }),
      this.setDefault({
        schema: 'public',
        table: 'User',
        column: 'role',
        defaultSql: `DEFAULT 'USER'::"USER_ROLE"`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
