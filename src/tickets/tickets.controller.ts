import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedRequest } from '../auth/dto/shared.dto.js';
import { RoleGuard } from '../auth/role.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { SessionGuard } from '../auth/session.guard.js';
import {
  type PaginationOptions,
  paginationOptionsSchema,
} from '../common/schema/pagination.schema.js';
import { uuidSchema } from '../common/schema/uuid.schema.js';
import {
  AcceptTicketOutput,
  acceptTicketOutputSchema,
  acceptTicketParamsSchema,
} from './dto/accept-ticket.dto.js';
import {
  type CreateTicketInput,
  CreateTicketOutput,
  createTicketInputSchema,
  createTicketOutputSchema,
} from './dto/create-ticket.dto.js';
import {
  DeleteTicketOutput,
  deleteTicketOutputSchema,
  deleteTicketParamsSchema,
} from './dto/delete-ticket.dto.js';
import {
  GetAssignedTicketsOutput,
  type GetAssignedTicketsQuery,
  getAssignedTicketsOutputSchema,
  getAssignedTicketsQuerySchema,
} from './dto/get-assigned-tickets.dto.js';
import {
  GetMyTicketsOutput,
  type GetMyTicketsQuery,
  getMyTicketsOutputSchema,
  getMyTicketsQuerySchema,
} from './dto/get-my-tickets.dto.js';
import {
  GetOpenTicketsOutput,
  getOpenTicketsOutputSchema,
} from './dto/get-open-tickets.dto.js';
import {
  GetTicketDetailsOutput,
  getTicketDetailsOutputSchema,
  getTicketDetailsParamsSchema,
} from './dto/get-ticket-details.js';
import {
  type ResolveTicketInput,
  ResolveTicketOutput,
  resolveTicketInputSchema,
  resolveTicketOutputSchema,
  resolveTicketParamsSchema,
} from './dto/resolve-ticket.dto.js';
import {
  type UpdateTicketInput,
  UpdateTicketOutput,
  updateTicketInputSchema,
  updateTicketOutputSchema,
} from './dto/update-ticket.dto.js';
import { TicketService } from './tickets.service.js';

@Controller('/tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketService) {}

  @Post()
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['USER'])
  async createTicket(
    @Req() req: AuthenticatedRequest,
    @Body({ schema: createTicketInputSchema }) ticketInput: CreateTicketInput,
  ): Promise<CreateTicketOutput> {
    const ticketResponse = await this.ticketsService.createTicket(
      req.auth.userId,
      ticketInput,
    );

    const parsedBody = createTicketOutputSchema.parse({
      ticket: ticketResponse,
      message: 'Ticket created successfully.',
    });
    return parsedBody;
  }

  @Get('/me')
  @UseGuards(SessionGuard)
  async getTickets(
    @Req() req: AuthenticatedRequest,
    @Query({
      schema: getMyTicketsQuerySchema,
    })
    query: GetMyTicketsQuery,
  ): Promise<GetMyTicketsOutput> {
    const ticketsResponse = await this.ticketsService.getMyTickets(
      req.auth.userId,
      query,
    );

    const parsedResponse = getMyTicketsOutputSchema.parse({
      tickets: ticketsResponse,
      message: 'Tickets received successfully.',
    });
    return parsedResponse;
  }

  @Get('/open')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['ADMIN'])
  async getOpenTickets(
    @Query({ schema: paginationOptionsSchema })
    paginationOptions: PaginationOptions,
  ): Promise<GetOpenTicketsOutput> {
    const openTickets =
      await this.ticketsService.getOpenTickets(paginationOptions);
    const parsedResponse = getOpenTicketsOutputSchema.parse({
      tickets: openTickets,
      message: 'Open tickets retrieved successfully.',
    });
    return parsedResponse;
  }

  @Get('/assigned')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['ADMIN'])
  async getAssignedTickets(
    @Req() req: AuthenticatedRequest,
    @Query({ schema: getAssignedTicketsQuerySchema })
    query: GetAssignedTicketsQuery,
  ): Promise<GetAssignedTicketsOutput> {
    const assignedTickets = await this.ticketsService.getAssignedTickets(
      req.auth.userId,
      query,
    );

    const parsedResponse = getAssignedTicketsOutputSchema.parse({
      tickets: assignedTickets,
      message: 'Assigned tickets retrieved successfully.',
    });
    return parsedResponse;
  }

  @Get('/:id')
  @UseGuards(SessionGuard)
  async getTicketDetails(
    @Req() req: AuthenticatedRequest,
    @Param('id', { schema: getTicketDetailsParamsSchema }) id: string,
  ): Promise<GetTicketDetailsOutput> {
    const parsedTicketId = uuidSchema.parse(id);

    const ticketResponse = await this.ticketsService.getTicketDetails(
      req.auth.userId,
      req.auth.role,
      parsedTicketId,
    );

    const parsedResponse = getTicketDetailsOutputSchema.parse({
      ticket: ticketResponse,
      message: 'Ticket received successfully.',
    });

    return parsedResponse;
  }

  @Patch('/:id')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['USER'])
  async updateTicket(
    @Req() req: AuthenticatedRequest,
    @Param('id', { schema: getTicketDetailsParamsSchema }) id: string,
    @Body({ schema: updateTicketInputSchema }) ticketInput: UpdateTicketInput,
  ): Promise<UpdateTicketOutput> {
    const parsedTicketId = uuidSchema.parse(id);
    const updatedTicket = await this.ticketsService.updateTicket(
      req.auth.userId,
      parsedTicketId,
      ticketInput,
    );
    const parsedResponse = updateTicketOutputSchema.parse({
      ticket: updatedTicket,
      message: 'Ticket updated successfully.',
    });
    return parsedResponse;
  }

  @Delete('/:id')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['USER'])
  async deleteTicket(
    @Req() req: AuthenticatedRequest,
    @Param('id', { schema: deleteTicketParamsSchema }) id: string,
  ): Promise<DeleteTicketOutput> {
    const parsedTicketId = uuidSchema.parse(id);
    await this.ticketsService.deleteTicket(req.auth.userId, parsedTicketId);
    const parsedResponse = deleteTicketOutputSchema.parse({
      message: 'Ticket deleted successfully.',
    });
    return parsedResponse;
  }

  @Patch('/:id/accept')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['ADMIN'])
  async acceptTicket(
    @Req() req: AuthenticatedRequest,
    @Param('id', { schema: acceptTicketParamsSchema }) id: string,
  ): Promise<AcceptTicketOutput> {
    const parsedTicketId = uuidSchema.parse(id);
    const updatedTicket = await this.ticketsService.acceptTicket(
      req.auth.userId,
      parsedTicketId,
    );
    const parsedResponse = acceptTicketOutputSchema.parse({
      ticket: updatedTicket,
      message: 'Ticket accepted successfully.',
    });
    return parsedResponse;
  }

  @Patch('/:id/resolve')
  @UseGuards(SessionGuard, RoleGuard)
  @Roles(['ADMIN'])
  async resolveTicket(
    @Req() req: AuthenticatedRequest,
    @Param('id', { schema: resolveTicketParamsSchema }) id: string,
    @Body({ schema: resolveTicketInputSchema })
    resolveTicketInput: ResolveTicketInput,
  ): Promise<ResolveTicketOutput> {
    const parsedTicketId = uuidSchema.parse(id);
    const updatedTicket = await this.ticketsService.resolveTicket(
      req.auth.userId,
      parsedTicketId,
      resolveTicketInput.reply,
    );
    const parsedResponse = resolveTicketOutputSchema.parse({
      ticket: updatedTicket,
      message: 'Ticket resolved successfully.',
    });
    return parsedResponse;
  }
}
