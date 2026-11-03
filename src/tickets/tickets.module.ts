import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TicketsController } from './tickets.controller.js';
import { TicketService } from './tickets.service.js';

@Module({
  controllers: [TicketsController],
  imports: [PrismaModule, AuthModule],
  providers: [TicketService],
})
export class TicketsModule {}
