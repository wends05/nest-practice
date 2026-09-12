import { Injectable } from '@nestjs/common';
import type { Uuid } from '../common/schema/uuid.schema.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // get the user by their id
  async findById(id: Uuid) {
    return this.prisma.db.orm.public.User.first({
      id,
    });
  }

  // get the user by their username
  async findByUsername(username: string) {
    return this.prisma.db.orm.public.User.where((u) =>
      u.username.ilike(`%${username}%`),
    ).limit(5);
  }
}
