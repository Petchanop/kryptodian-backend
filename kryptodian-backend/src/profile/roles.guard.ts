import { Injectable, CanActivate, ExecutionContext, ConsoleLogger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './decorators/public.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles: UserRole[] | undefined = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log("roles", !requiredRoles || requiredRoles === undefined);
        if (!requiredRoles || requiredRoles === undefined) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        console.log(user, requiredRoles);
        const res = requiredRoles.includes(user.role);
        console.log(res);
        return res;
    }
}