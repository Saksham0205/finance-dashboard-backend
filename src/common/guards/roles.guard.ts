import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.Admin]: [Role.Admin, Role.Analyst, Role.Viewer],
  [Role.Analyst]: [Role.Analyst, Role.Viewer],
  [Role.Viewer]: [Role.Viewer],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException({ error: 'Forbidden', detail: 'No user found in request' });
    }
    const userEffectiveRoles = ROLE_HIERARCHY[user.role as Role] || [];
    const hasRole = requiredRoles.some((role) => userEffectiveRoles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException({
        error: 'Forbidden',
        detail: `Role '${user.role}' does not have access to this resource`,
      });
    }
    return true;
  }
}
