import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { ROLES_KEY } from '../decorators/roles.decorator';

interface UserRole {
  role_name: string;
}

interface RequestUser {
  id: string;

  email: string;

  roles: UserRole[];
}

interface RequestWithUser extends Request {
  user: RequestUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    if (!user) {
      return false;
    }

    const hasRole = user.roles.some((role: UserRole) =>
      requiredRoles.includes(role.role_name),
    );

    return hasRole;
  }
}
