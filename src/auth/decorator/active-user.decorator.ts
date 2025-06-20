import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserInterface } from '../interfaces/active-user.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request[REQUEST_USER_KEY];
    return field ? user[field] : user;
  },
);
