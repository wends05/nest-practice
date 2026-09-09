import {
  defineContract,
  enumType,
  member,
} from '@prisma/orm-postgres/contract-builder';

const USER_ROLE = enumType(
  'USER_ROLE',
  {
    codecId: 'pg/text@1',
    nativeType: 'text',
  } as const,
  member('ADMIN'),
  member('USER'),
);

const TICKET_STATUS = enumType(
  'TICKET_STATUS',
  {
    codecId: 'pg/text@1',
    nativeType: 'text',
  } as const,
  member('OPEN'),
  member('ASSIGNED'),
  member('CLOSED'),
);

export const contract = defineContract({}, ({ field, model, rel }) => {
  const Ticket = model('Ticket', {
    fields: {
      id: field.id.uuidv7String(),
      ownedBy: field.uuidString(),
      assignedTo: field.uuidString(),
      title: field.text(),
      content: field.text(),
      status: field.namedType(TICKET_STATUS).default('OPEN'),
    },
  });

  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      name: field.text(),
      username: field.text().unique(),
      role: field.namedType(USER_ROLE).default('USER'),
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
