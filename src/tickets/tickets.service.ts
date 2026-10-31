import { Injectable } from '@nestjs/common';
import { Role } from '../auth/dto/role.dto.js';
import { PaginationOptions } from '../common/schema/pagination.schema.js';
import { Uuid } from '../common/schema/uuid.schema.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTicketInput } from './dto/create-ticket.dto.js';
import { GetAssignedTicketsQuery } from './dto/get-assigned-tickets.dto.js';
import { GetMyTicketsQuery } from './dto/get-my-tickets.dto.js';
import {
  TicketDetailsResponse,
  TicketResponse,
  ticketDetailsResponseSchema,
  ticketResponseSchema,
} from './dto/shared.dto.js';
import { UpdateTicketInput } from './dto/update-ticket.dto.js';
import {
  TicketAlreadyAcceptedException,
  TicketNotEditableException,
  TicketNotFoundException,
  TicketNotOwnedException,
  TicketOwnedException,
} from './tickets.errors.js';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a ticket as a user.
   */
  async createTicket(
    ownerId: Uuid,
    ticket: CreateTicketInput,
  ): Promise<TicketResponse> {
    const createdTicket = await this.prisma.db.orm.public.Ticket.create({
      ...ticket,
      ownedBy: ownerId,
    });

    const parsedTicket = ticketResponseSchema.parse(createdTicket);

    return parsedTicket;
  }

  /**
   * Gets my own tickets as a user.
   */
  async getMyTickets(
    ownerId: Uuid,
    query: GetMyTicketsQuery,
  ): Promise<TicketResponse[]> {
    const myTickets = await this.prisma.db.orm.public.Ticket.where({
      ownedBy: ownerId,
      ...(query.status && { status: query.status }),
    })
      .offset(query.offset)
      .limit(query.limit)
      .orderBy((t) => t.createdAt.asc())
      .all();

    const parsedTickets = ticketResponseSchema.array().parse(myTickets);

    return parsedTickets;
  }

  /**
   * Gets a specific ticket details as a user.
   */
  async getTicketDetails(
    userId: Uuid,
    role: Role,
    ticketId: Uuid,
  ): Promise<TicketDetailsResponse> {
    // Rules for being able to view a ticket:
    // - Ticket is owned by the user
    // - Ticket is being resolved by the user (admin)
    // - Ticket is OPEN, opened by an admin

    const ticket = await this.prisma.db.orm.public.Ticket.where({
      id: ticketId,
    })
      .include('owner', (o) => o.select('id', 'name', 'username'))
      .include('resolver', (o) => o.select('id', 'name', 'username'))
      .first();

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    const isOwner = ticket.ownedBy === userId;
    const isAssigned = ticket.assignedTo === userId;
    const isAdminViewOpening = role === 'ADMIN' && ticket.status === 'OPEN';

    if (!isOwner && !isAssigned && !isAdminViewOpening) {
      throw new TicketNotFoundException(
        'You do not have permission to view this ticket.',
      );
    }

    const parsedTicket = ticketDetailsResponseSchema.parse(ticket);

    return parsedTicket;
  }

  /**
   * Updates own ticket details.
   */
  async updateTicket(
    userId: Uuid,
    ticketId: Uuid,
    newTicket: UpdateTicketInput,
  ): Promise<TicketResponse> {
    // check if you are the owner of the ticket
    // a resolver cannot edit details

    const ticket = await this.prisma.db.orm.public.Ticket.first({
      id: ticketId,
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.ownedBy !== userId) {
      throw new TicketNotFoundException(
        'You do not have permission to update this ticket.',
      );
    }

    if (ticket.status !== 'OPEN') {
      throw new TicketNotEditableException(
        'You cannot edit this ticket anymore as it is being resolved.',
      );
    }

    const updatedTicket = await this.prisma.db.orm.public.Ticket.where({
      id: ticketId,
      status: 'OPEN',
      ownedBy: userId,
    }).update(newTicket);

    if (!updatedTicket) {
      throw new TicketNotEditableException();
    }

    const parsedTicket = ticketResponseSchema.parse(updatedTicket);

    return parsedTicket;
  }

  /**
   * Accepts a ticket as a resolver.
   */
  async acceptTicket(userId: Uuid, ticketId: Uuid): Promise<TicketResponse> {
    // check if the ticket exists
    const ticket = await this.prisma.db.orm.public.Ticket.first({
      id: ticketId,
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    // check if you are the owner
    if (ticket.ownedBy === userId) {
      throw new TicketOwnedException();
    }

    // check if the ticket is already assigned
    if (ticket.status === 'ASSIGNED' || ticket.assignedTo !== null) {
      throw new TicketAlreadyAcceptedException();
    }

    const updatedTicket = await this.prisma.db.orm.public.Ticket.where({
      id: ticketId,
      assignedTo: null,
    }).update({ status: 'ASSIGNED', assignedTo: userId });

    if (!updatedTicket) {
      throw new TicketAlreadyAcceptedException();
    }

    const parsedTicket = ticketResponseSchema.parse(updatedTicket);

    return parsedTicket;
  }

  /**
   * Transitions the status of ticket to 'CLOSED' as a resolver.
   */
  async resolveTicket(
    userId: Uuid,
    ticketId: Uuid,
    reply: string,
  ): Promise<TicketResponse> {
    // ensure that the user is a resolver of the ticket

    const ticket = await this.prisma.db.orm.public.Ticket.first({
      id: ticketId,
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.assignedTo !== userId) {
      throw new TicketNotFoundException(
        'You do not have permission to transition this ticket.',
      );
    }

    if (ticket.status !== 'ASSIGNED') {
      throw new TicketNotEditableException(
        'This ticket is not assigned and cannot be resolved.',
      );
    }

    const updatedTicket = await this.prisma.db.orm.public.Ticket.where({
      id: ticketId,
      assignedTo: userId,
      status: 'ASSIGNED',
    }).update({ status: 'CLOSED', reply });

    if (!updatedTicket) {
      throw new TicketNotEditableException();
    }

    const parsedTicket = ticketResponseSchema.parse(updatedTicket);

    return parsedTicket;
  }

  /**
   * Deletes a ticket as a user.
   */
  async deleteTicket(userId: Uuid, ticketId: Uuid): Promise<void> {
    const ticket = await this.prisma.db.orm.public.Ticket.first({
      id: ticketId,
    });

    if (!ticket) {
      throw new TicketNotFoundException();
    }

    if (ticket.ownedBy !== userId) {
      throw new TicketNotOwnedException();
    }

    const deletedTicket = await this.prisma.db.orm.public.Ticket.where({
      id: ticketId,
    }).delete();

    if (!deletedTicket) {
      throw new TicketNotFoundException();
    }
  }

  /**
   * Gets a list of assigned tickets as an admin.
   */
  async getAssignedTickets(
    userId: Uuid,
    query: GetAssignedTicketsQuery,
  ): Promise<TicketResponse[]> {
    const pendingTickets = await this.prisma.db.orm.public.Ticket.where({
      assignedTo: userId,
      ...(query.status && { status: query.status }),
    })
      .offset(query.offset)
      .limit(query.limit)
      .orderBy((t) => t.createdAt.asc())
      .all();

    const parsedPendingTickets = ticketResponseSchema
      .array()
      .parse(pendingTickets);
    return parsedPendingTickets;
  }

  /**
   * Gets a list of open tickets as an admin.
   */
  async getOpenTickets(
    paginationOptions: PaginationOptions,
  ): Promise<TicketResponse[]> {
    const openTickets = await this.prisma.db.orm.public.Ticket.where({
      assignedTo: null,
      status: 'OPEN',
    })
      .offset(paginationOptions.offset)
      .limit(paginationOptions.limit)
      .orderBy((t) => t.createdAt.asc())
      .all();

    const parsedOpenTickets = ticketResponseSchema.array().parse(openTickets);
    return parsedOpenTickets;
  }
}
