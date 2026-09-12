import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a ticket as a user
  async createTicket() {}
  // Get my own tickets as a user
  // Update a ticket as a user
  // Remove a ticket as a user

  // Get a list of pending tickets as an admin
  // Get a specific ticket details as an admin
  // Get a list of accepted tickets as an admin
  // Update a ticket as resolved as an admin
  // Remove a ticket as an admin
}
