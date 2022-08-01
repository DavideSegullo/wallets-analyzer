import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractChainName } from 'src/utils';

export const Chain = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return extractChainName(request);
  },
);
