import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TicketService } from './tickets.service';

@Module({
  controllers: [],
  imports: [PrismaModule],
  providers: [TicketService],
})
export class TicketsModule {}
