import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthUser } from '../models/auth-user.model';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    return context.switchToHttp().getRequest().user;
  },
);
