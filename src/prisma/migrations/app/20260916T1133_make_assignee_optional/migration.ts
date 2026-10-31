#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/02dcf1b747f06c819fcbcefeb0a066237b8ee3be6b6305ff536a34d3cdec29b7/contract';
import endContract from '../../snapshots/02dcf1b747f06c819fcbcefeb0a066237b8ee3be6b6305ff536a34d3cdec29b7/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/1fe52f4491cfaf0f6ba85e90dc2704ee0d6e89a9a791264f2eaf06eaa2a51bc6/contract';
import startContract from '../../snapshots/1fe52f4491cfaf0f6ba85e90dc2704ee0d6e89a9a791264f2eaf06eaa2a51bc6/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropNotNull({ schema: 'public', table: 'Ticket', column: 'assignedTo' })];
  }
}

MigrationCLI.run(import.meta.url, M);
