import {
  defineContract,
  nativeEnum,
  pg,
} from '@prisma/orm-postgres/contract-builder';

export const USER_ROLE = nativeEnum('USER_ROLE', 'ADMIN', 'USER');

export const TICKET_STATUS = nativeEnum(
  'TICKET_STATUS',
  'OPEN',
  'ASSIGNED',
  'CLOSED',
);

export const contract = defineContract({}, ({ field, model, rel }) => {
  const Ticket = model('Ticket', {
    fields: {
      id: field.id.uuidv7String(),
      ownedBy: field.uuidString(),
      assignedTo: field.uuidString().optional(),
      title: field.text(),
      content: field.text(),
      reply: field.text().optional(),
      status: field.column(pg.enum(TICKET_STATUS)).default('OPEN'),
      createdAt: field.temporal.createdAt(),
    },
  });

  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      name: field.text(),
      username: field.text().unique(),
      role: field.column(pg.enum(USER_ROLE)).default('USER'),
      passwordHash: field.text(),
    },
  });

  const Session = model('Session', {
    fields: {
      id: field.id.uuidv7String(),
      userId: field.uuidString(),
      tokenHash: field.text().unique(),
      expiresAt: field.temporal.timestamptzString(),
      createdAt: field.temporal.createdAtString(),
      revokedAt: field.temporal.timestamptzString().optional(),
    },
  });

  return {
    models: {
      Ticket: Ticket.relations({
        owner: rel.belongsTo(User, { from: 'ownedBy', to: 'id' }),
        resolver: rel.belongsTo(User, { from: 'assignedTo', to: 'id' }),
      }),
      User: User.relations({
        session: rel.hasMany(Session, { by: 'userId' }),
        ticket: rel.hasMany(Ticket, { by: 'ownedBy' }),
        resolvedTicket: rel.hasMany(Ticket, { by: 'assignedTo' }),
      }),
      Session: Session.relations({
        user: rel.belongsTo(User, { from: 'userId', to: 'id' }),
      }),
    },
  };
});
