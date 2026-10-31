import { Reflector } from '@nestjs/core';
import { Role } from './dto/role.dto';

export const Roles = Reflector.createDecorator<Role[]>();
