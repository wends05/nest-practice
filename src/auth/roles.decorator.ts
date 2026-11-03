import { Reflector } from '@nestjs/core';
import { Role } from './dto/role.dto.js';

export const Roles = Reflector.createDecorator<Role[]>();
